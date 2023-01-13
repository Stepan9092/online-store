import ViewCart from '../components/view/cart/cart'

const cart = new ViewCart();

describe('input validation', () => {
  test('contains at least two words, each at least 3 characters long', () => {
    expect(cart.isValidName('James Hurt')).toBe(true);
  });
  
  test('must start with +, contain only digits and be at least 9 digits', () => {
    expect(cart.isValidPhone('+134583453454')).toBe(true);
  });
  
  test('contains at least three words, each at least 5 characters long', () => {
    expect(cart.isValidEmail('jameshurt@email.us')).toBe(true);
  });
  
  test('checks if the entered text is email', () => {
    expect(cart.isValidAddress('los-angeles california sunny-beach')).toBe(true);
  });
  
  test('the number of entered digits must be exactly 16, only digits are allowed', () => {
    expect(cart.isValidCardNumber('1111 2222 3333 4444')).toBe(true);
  });
  
  test('Card Thru validation', () => {
    expect(cart.isValidThru('12/23')).toBe(true);
  });
  
  test('3 characters long, only numbers allowed', () => {
    expect(cart.isValidCVV('373')).toBe(true);
  });
});



