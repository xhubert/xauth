const crypto = require('crypto')

module.exports = {
  encryptWithSalt: original => {
    if (!original || original.length === 0) {
      return null
    }
    const md5 = crypto.createHash('md5')
    let salt
    if (original.length >= 6) {
      salt = original.slice(1, 3) + original.slice(2, 5)
    } else {
      salt = original
      // throw new Error('The original text that needs to be encrypted cannot be shorter than 6 digits!');
    }
    const ciphertext = md5.update(original + ':' + salt).digest('hex')
    return ciphertext
  }
}
