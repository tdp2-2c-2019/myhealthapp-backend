import CryptoService from './crypto';

describe('Crypto Service', () => {
  test('comparint two same keys should return true', () => {
    const msg = 'example';
    CryptoService.encrypt(msg).then((hashedMsg) => {
      expect(CryptoService.compare(msg, hashedMsg)).resolves.toBeTruthy();
    });
  });

  test('comparing different keys should return false', () => {
    const msg = 'example';
    const msg2 = 'other message';
    CryptoService.encrypt(msg).then((hashedMsg) => {
      expect(CryptoService.compare(msg2, hashedMsg)).resolves.toBeFalsy();
    });
  });
});
