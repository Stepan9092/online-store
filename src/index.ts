import './index.html';
import './index.scss';

console.log('start');

// const lowerSlider: HTMLInputElement | null = document.querySelector('#lower');
// const upperSlider: HTMLInputElement | null = document.querySelector('#upper');

// if (lowerSlider && upperSlider) {
//   let lowerVal: number = parseInt(lowerSlider.value);
//   let upperVal: number = parseInt(upperSlider.value);

//   upperSlider.oninput = function () {
//     if (lowerSlider && upperSlider) {
//       lowerVal = parseInt(lowerSlider.value);
//       upperVal = parseInt(upperSlider.value);

//       if (upperVal < lowerVal + 1) {
//         lowerSlider.value = String(upperVal - 1);

//         if (lowerVal === parseInt(lowerSlider.min)) {
//           upperSlider.value = String(1);
//         }
//       }
//     }
//   };

//   lowerSlider.oninput = function () {
//     if (lowerSlider && upperSlider) {
//       lowerVal = parseInt(lowerSlider.value);
//       upperVal = parseInt(upperSlider.value);

//       if (lowerSlider && upperSlider) {
//         if (lowerVal > upperVal - 1) {
//           upperSlider.value = String(lowerVal + 1);

//           if (upperVal === parseInt(upperSlider.max)) {
//             lowerSlider.value = String(parseInt(upperSlider.max) - 1);
//           }
//         }
//       }
//     }
//   };
// }
