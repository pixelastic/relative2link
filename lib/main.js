const _ = require('golgoth/lodash');
const readJson = require('firost/readJson');
const exists = require('firost/exists');
const read = require('firost/read');
const write = require('firost/write');
const path = require('path');
const pMap = require('golgoth/pMap');

module.exports = {
  async run(files) {
    // Array of { link, absolutePath }, more specific to least specific
    const links = await this.getLinks();

    await pMap(files, async (filepath) => {
      await this.convertFile(filepath);
    });

    // Now we read all files
    // We look for the pattern import XXX from 'YYY'
    // We convert YYY to absolute, based on the current file
    // We see if match in our list, we replace with shortcut
  },
  /**
   * Convert content of a file in place
   * @param {string} filepath Path to the file to convert
   * @returns {boolean} true on success, false otherwise
   **/
  async convertFile(filepath) {
    if (!(await exists(filepath))) {
      return false;
    }

    const initialContent = await read(filepath);
    const newContent = this.convertContent(initialContent);

    await write(newContent, filepath);
    return true;
  },
  /**
   * Convert content to use links instead of relative
   * @param {string} content Initial file content
   * @param filepath
   * @returns {string} Converted file content
   */
  convertContent(content, filepath) {
    const regexp = /^import version from (?<source>.*);?$/gm;
    return content.replace(regexp, (originalString, match) => {
      const source = _.chain(match)
        .replace('"', '')
        .replace("'", '')
        .thru(this.toAbsolute)
        .value();
      console.info({ originalString, match, source });
      return 'nop';
    });
  },
  replaceFunction() {},
  toAbsolute(filepath) {
    return path.resolve(filepath);
  },
  /**
   * Returns an array of .link, .absolutePath links
   * @returns {Array} List of links
   **/
  async getLinks() {
    if (!this.__links) {
      const content = await readJson('package.json');
      this.__links = _.chain(content)
        .get('dependencies', {})
        .filter((value) => {
          return _.startsWith(value, 'link:');
        })
        .map((relativePath, link) => {
          const absolutePath = _.chain(relativePath)
            .replace('link:', '')
            .thru(this.toAbsolute)
            .value();
          return { link, absolutePath };
        })
        .value();
    }
    return this.__links;
  },
};
