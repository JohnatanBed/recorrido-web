export const MURAL_SECONDARY_HOTSPOTS = [
    {
        id: 'mural-secundario-1',
        top: '39%',
        left: '36%',
        message: 'No sé dónde me duele.',
        videoUrl: 'https://www.youtube.com/embed/oaNv4WtfpQw?si=Jno_bS8dMdRRZA0W',
    },
    {
        id: 'mural-secundario-2',
        top: '30%',
        left: '51%',
        message: 'El tiempo pasa en "un instante". Cómo desearía poder recordar.',
        videoUrl: 'https://www.youtube.com/embed/Nvtiku_XXTU?si=L4jMcWq8VEC9hULO',
    },
    {
        id: 'mural-secundario-3',
        top: '57%',
        left: '70%',
        message: 'Me hubiera encantado tener esa conversación con papá, pero él ya no está.',
        videoUrl: 'https://www.youtube.com/embed/onQKlbU0TAo?si=GBIdRKQnxfN6_xD9',
    },
];

export const MESSAGE_LAYOUTS = [
    { top: '6%', left: '6%', rotate: '-3deg' },
    { top: '8%', left: '38%', rotate: '2deg' },
    { top: '5%', left: '68%', rotate: '-2deg' },
    { top: '26%', left: '10%', rotate: '1deg' },
    { top: '28%', left: '42%', rotate: '-1deg' },
    { top: '25%', left: '74%', rotate: '3deg' },
    { top: '52%', left: '5%', rotate: '-2deg' },
    { top: '50%', left: '33%', rotate: '2deg' },
    { top: '54%', left: '67%', rotate: '-1deg' },
    { top: '76%', left: '14%', rotate: '2deg' },
    { top: '74%', left: '46%', rotate: '-3deg' },
    { top: '78%', left: '74%', rotate: '1deg' },
];

export const getNotaLayout = (index) => MESSAGE_LAYOUTS[index % MESSAGE_LAYOUTS.length];
