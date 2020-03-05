const mockStart = {cursor: 6810, line: 270, column: 15};
const mockNext = {cursor: 6841, line: 270, column: 46};

export const mockCustomPropertyErrors = {
  '--p-border-radius-base': {
    declaration: false,
    usedFromDeclaration: false,
    count: 1,
    locations: [
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/ActionList/ActionList.scss',
      },
    ],
  },
};

export const mockCustomProperties = {
  '--Polaris-RangeSlider-progress-lower': {
    declaration: false,
    usedFromDeclaration: false,
    count: 4,
    locations: [
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
    ],
  },
  '--Polaris-RangeSlider-progress-upper': {
    declaration: false,
    usedFromDeclaration: false,
    count: 4,
    locations: [
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file: 'src/components/RangeSlider/components/DualThumb/DualThumb.scss',
      },
    ],
  },
  '--progress-lower': {
    declaration: true,
    usedFromDeclaration: false,
    count: 4,
    locations: [
      {
        start: mockStart,
        end: mockNext,
        file:
          'src/components/RangeSlider/components/SingleThumb/SingleThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file:
          'src/components/RangeSlider/components/SingleThumb/SingleThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file:
          'src/components/RangeSlider/components/SingleThumb/SingleThumb.scss',
      },
      {
        start: mockStart,
        end: mockNext,
        file:
          'src/components/RangeSlider/components/SingleThumb/SingleThumb.scss',
      },
    ],
  },
};
