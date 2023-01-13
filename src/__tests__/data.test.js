import Model from '../components/model/model';

const model = new Model();

test('method should return array of products', () => {
  expect(model.getGoodsByIDs(['1'])).toBeDefined();
  expect(model.getGoodsByIDs(['1'])).toEqual({"products": [{"category": "walking", "color": "grey", "description": "The men's New Balance 608v5 is a classic trainer designed with a premium PU nsert to help offer reliable comfort for long days spent on feet.", "discountPercentage": 5, "gender": "men", "id": 1, "images": ["./data/products/1/2.webp", "./data/products/1/3.webp", "./data/products/1/4.webp", "./data/products/1/5.webp", "./data/products/1/thumbnail.webp"], "manufacturer": 
  "New Balance", "price": 79.99, "rating": 4.64, "size": [8, 8.5, 9, 10, 10.5, 11, 12], "stock": 68, "thumbnail": "./data/products/1/thumbnail.webp", "title": "Men's 608 V5 Casual Comfort Cross Trainer"}]});
});

test('method should return number of category items', () => {
  expect(model.getCategoryItemsCount('gender', 'men')).toBe(25);
});

test('method should return number of category items', () => {
  expect(model.getFilterItems('category')).toBeDefined();
  expect(model.getFilterItems('category')).toEqual(new Set (["walking", "running", "skateboarding"]));
});

