export const promptOpsTailwindConfig = {
  theme: {
    extend: {
      colors: {
        canvas: '#fafafa',
        bg: '#ffffff',
        fg: '#161615',
        'fg-2': '#42413f',
        'fg-3': '#79797a',
        stroke: '#e7e5e4',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        11: ['11px', { lineHeight: '16px' }],
        13: ['13px', { lineHeight: '18px' }],
        14: ['14px', { lineHeight: '20px' }],
        16: ['16px', { lineHeight: '24px' }],
        24: ['24px', { lineHeight: '28px' }],
        48: ['48px', { lineHeight: '56px' }],
      },
      borderRadius: {
        2: '2px',
        4: '4px',
        8: '8px',
      },
      boxShadow: {
        'collage-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        4.5: '18px',
      },
    },
  },
};
