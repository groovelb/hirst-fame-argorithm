import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useLocale } from '../../i18n';
import { SpecimenDetailModal } from './SpecimenDetailModal.jsx';

const IMAGE_BASE = '/images/hirst/specimen-infographic';

const SPECIES_ROWS = [
  {
    key: 'butterfly_live_2012',
    label: { ko: '나비', en: 'Butterflies' },
    scientific: 'mixed tropical species',
    image: `${ IMAGE_BASE }/specimen-butterfly-reliquary.png`,
  },
  {
    key: 'shark',
    label: { ko: '상어', en: 'Sharks' },
    scientific: 'Galeocerdo cuvier, Cetorhinus maximus',
    image: `${ IMAGE_BASE }/specimen-shark-vitrine.png`,
  },
  {
    key: 'sheep',
    label: { ko: '양', en: 'Sheep' },
    scientific: 'Ovis aries',
    image: `${ IMAGE_BASE }/specimen-ruminant-plate.png`,
  },
  {
    key: 'bovine',
    label: { ko: '소', en: 'Bovine' },
    scientific: 'Bos taurus',
    image: `${ IMAGE_BASE }/specimen-ruminant-plate.png`,
  },
  {
    key: 'pig',
    label: { ko: '돼지', en: 'Pig' },
    scientific: 'Sus scrofa domesticus',
    image: `${ IMAGE_BASE }/specimen-pig.png`,
  },
  {
    key: 'zebra',
    label: { ko: '얼룩말', en: 'Zebra' },
    scientific: 'Equus quagga',
    image: `${ IMAGE_BASE }/specimen-zebra.png`,
  },
  {
    key: 'dove',
    label: { ko: '비둘기', en: 'Dove' },
    scientific: 'Columba livia domestica',
    image: `${ IMAGE_BASE }/specimen-dove.png`,
  },
  {
    key: 'cockerel',
    label: { ko: '수탉', en: 'Cockerel' },
    scientific: 'Gallus gallus domesticus',
    image: `${ IMAGE_BASE }/specimen-cockerel.png`,
  },
];

function formatCount(value, locale) {
  if (!Number.isFinite(value)) return locale === 'ko' ? '미공개' : '—';
  return value.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US');
}

/**
 * SpeciesCard — 종 한 칸. 이미지 + 영문 타이틀(헤드라인 폰트) + 수치. 클릭하면 모달.
 *
 * Props:
 * @param {Object} species - 종 데이터 [Required]
 * @param {string} locale - 로케일 [Required]
 * @param {function} onOpen - 클릭 콜백 [Required]
 */
function SpeciesCard({ species, locale, onOpen }) {
  return (
    <ButtonBase
      onClick={ () => onOpen(species) }
      focusRipple
      sx={ {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        transition: (theme) => theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover img': {
          opacity: 1,
        },
      } }
    >
      <Box
        component="img"
        src={ species.image }
        alt=""
        aria-hidden="true"
        onError={ (event) => { event.currentTarget.style.opacity = 0; } }
        sx={ {
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          opacity: 0.92,
          filter: 'contrast(1.04)',
        } }
      />
      <Box
        sx={ {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.6,
          px: { xs: 1.6, md: 2.2 },
          py: { xs: 1.6, md: 2 },
        } }
      >
        <Typography
          variant="h4"
          sx={ {
            color: 'text.primary',
            lineHeight: 1.1,
            fontSize: { xs: '1.1rem', md: '1.4rem', lg: '1.6rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          } }
        >
          { species.labelEn }
        </Typography>
        <Typography
          variant="caption"
          sx={ {
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          } }
        >
          { species.scientific }
        </Typography>
        <Box
          sx={ {
            mt: 'auto',
            pt: { xs: 1, md: 1.4 },
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1,
          } }
        >
          <Typography
            sx={ {
              fontWeight: 500,
              fontSize: { xs: '1.4rem', md: '1.8rem', lg: '2.2rem' },
              color: species.count == null ? 'text.disabled' : 'text.primary',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            } }
          >
            { formatCount(species.count, locale) }
          </Typography>
          <Typography variant="overline" sx={ { color: 'text.secondary' } }>
            { locale === 'ko' ? '개체' : 'individuals' }
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}

/**
 * SpecimenInfographicSection — 표본 집계 인포그래픽.
 *
 * 상단: 간단한 타이틀 + 총합 수치.
 * 하단: 종별 카드 그리드 (4 cols × 2 rows). 카드 클릭 → SpecimenDetailModal.
 * 종 영문 타이틀만 헤드라인 폰트(Georgia), 나머지는 프로덕션 폰트(Pretendard).
 *
 * Props:
 * @param {Object} bioData - bio-specimen JSON [Required]
 * @param {number} width - 섹션 너비(px) [Required]
 * @param {number} viewportHeight - 섹션 높이(px) [Required]
 */
function SpecimenInfographicSection({ bioData, width, viewportHeight }) {
  const { locale, localized } = useLocale();
  const [selected, setSelected] = useState(null);

  const data = useMemo(() => {
    const summary = bioData?.speciesSummary ?? {};
    const species = SPECIES_ROWS.map((row) => {
      const item = summary[row.key] ?? {};
      return {
        ...row,
        labelKo: row.label.ko,
        labelEn: row.label.en,
        labelText: localized(row.label) ?? row.key,
        count: Number.isFinite(item.individualCount) ? item.individualCount : null,
      };
    });
    const human = summary.human_remains ?? {};
    return {
      species,
      animalTotal: species.reduce((s, r) => s + (r.count ?? 0), 0),
      humanCount: Number.isFinite(human.individualCount) ? human.individualCount : null,
    };
  }, [bioData, localized]);

  const sourceDate = bioData?.caveats?.asOfDate ?? '2026-05-07';

  return (
    <Box
      component="section"
      sx={ {
        position: 'relative',
        width,
        minHeight: viewportHeight,
        backgroundColor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 4, md: 7, lg: 10 },
        py: { xs: 4, md: 6 },
        gap: { xs: 3, md: 5 },
      } }
    >
      <Box sx={ { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' } }>
        <Box>
          <Typography variant="overline" sx={ { color: 'text.secondary' } }>
            Biological Specimen Ledger
          </Typography>
          <Typography
            sx={ {
              mt: { xs: 0.8, md: 1.2 },
              fontWeight: 500,
              fontSize: { xs: '2.4rem', md: '3.2rem', lg: '3.8rem' },
              lineHeight: 1,
              color: 'text.primary',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            } }
          >
            { formatCount(data.animalTotal, locale) }
            <Typography
              component="span"
              variant="body1"
              sx={ { ml: 1.4, color: 'text.secondary' } }
            >
              { locale === 'ko' ? '개체 총합' : 'total individuals' }
            </Typography>
          </Typography>
        </Box>

        <Box sx={ { display: 'flex', gap: { xs: 3, md: 5 }, alignItems: 'flex-end' } }>
          { [
            [locale === 'ko' ? 'Tate 나비' : 'Tate butterflies', 9000],
            [locale === 'ko' ? '인간 유해' : 'Human remains', data.humanCount],
          ].map(([label, value]) => (
            <Box key={ label }>
              <Typography
                sx={ {
                  fontWeight: 500,
                  fontSize: { xs: '1.2rem', md: '1.6rem' },
                  color: 'text.primary',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                } }
              >
                { formatCount(value, locale) }
              </Typography>
              <Typography variant="overline" sx={ { display: 'block', mt: 0.6, color: 'text.secondary' } }>
                { label }
              </Typography>
            </Box>
          )) }
          <Typography
            variant="caption"
            sx={ {
              color: 'text.disabled',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              alignSelf: 'flex-end',
            } }
          >
            { locale === 'ko' ? `기준 · ${ sourceDate }` : `As of ${ sourceDate }` }
          </Typography>
        </Box>
      </Box>

      <Grid
        container
        spacing={ { xs: 1.5, md: 2, lg: 2.5 } }
        sx={ { flex: 1, minHeight: 0 } }
      >
        { data.species.map((sp) => (
          <Grid
            key={ sp.key }
            size={ { xs: 6, sm: 4, md: 3 } }
            sx={ { display: 'flex' } }
          >
            <SpeciesCard species={ sp } locale={ locale } onOpen={ setSelected } />
          </Grid>
        )) }
      </Grid>

      <SpecimenDetailModal
        open={ !!selected }
        onClose={ () => setSelected(null) }
        species={ selected }
        artworks={ bioData?.artworks ?? [] }
      />
    </Box>
  );
}

export { SpecimenInfographicSection };
