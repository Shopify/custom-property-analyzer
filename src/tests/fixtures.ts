import {Node} from '../analyze-custom-properties';

const mockStart = {cursor: 6810, line: 270, column: 15};
const mockNext = {cursor: 6841, line: 270, column: 46};

export const mockVarNode: Node = {
  type: 'function',
  value: [
    {type: 'identifier', value: 'var', start: mockStart, next: mockNext},
    {
      type: 'arguments',
      value: [
        {
          type: 'identifier',
          value: 'var',
          start: mockStart,
          next: mockNext,
        },
        {
          type: 'arguments',
          value: [
            {
              type: 'operator',
              value: '-',
              start: mockStart,
              next: mockNext,
            },
            {
              type: 'operator',
              value: '-',
              start: mockStart,
              next: mockNext,
            },
            {
              type: 'identifier',
              value: 'p-critical-link-disabled',
              start: mockStart,
              next: mockNext,
            },
          ],
          start: mockStart,
          next: mockNext,
        },
      ],
      start: mockStart,
      next: mockNext,
    },
  ],
  start: mockStart,
  next: mockNext,
};

export const mockPunctuation: Node = {
  type: 'punctuation',
  value: ':',
  start: mockStart,
  next: mockNext,
};

export const mockArguments: Node = {
  type: 'arguments',
  value: [
    {
      type: 'string_single',
      value: 'orange',
      start: mockStart,
      next: mockNext,
    },
    {
      type: 'punctuation',
      value: ',',
      start: mockStart,
      next: mockNext,
    },
    {
      type: 'space',
      value: ' ',
      start: mockStart,
      next: mockNext,
    },
    {
      type: 'string_single',
      value: 'text',
      start: mockStart,
      next: mockNext,
    },
  ],
  start: mockStart,
  next: mockNext,
};
