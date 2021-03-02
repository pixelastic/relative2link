const current = require('../main.js');

describe('relative2link', () => {
  beforeEach(async () => {
    jest.spyOn(current, 'toAbsolute').mockImplementation((filepath) => {
      return `/${filepath}`;
    });
  });

  describe('convertContent', () => {
    beforeEach(async () => {
      jest
        .spyOn(current, 'getLinks')
        .mockReturnValue([{ link: '@app/utils', absolutePath: '/src/utils' }]);
    });

    it.each([
      [
        "import version from './version'",
        '/src/utils/index',
        "import version from '@app/utils/version'",
      ],
    ])('%s in %s', async (input, filepath, expected) => {
      const actual = current.convertContent(input, filepath);
      expect(actual).toEqual(expected);
    });
  });
});
