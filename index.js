const oneBoxButtons = document.querySelectorAll(".box-one button");
const twoBoxButtons = document.querySelectorAll(".box-two button");
const leftInput = document.querySelector('.left-input');
const rightInput = document.querySelector('.right-input');

let currentValue = 'RUB';
let selectedValue = 'USD';

const updateConversion = () => {
  const inputValue = parseFloat(leftInput.value) || 0;
  const url = `https://v6.exchangerate-api.com/v6/0891076ce69498770fe876d1/latest/${currentValue}`;

  if (currentValue === selectedValue) {
    rightInput.value = leftInput.value;
    return;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      return response.json();
    })
    .then(data => {
      if (!data.conversion_rates) {
        throw new Error('Invalid response from server');
      }
      const convertedValues = {
        RUB: (data.conversion_rates.RUB * inputValue).toFixed(2),
        EUR: (data.conversion_rates.EUR * inputValue).toFixed(2),
        USD: (data.conversion_rates.USD * inputValue).toFixed(2),
        AZN: (data.conversion_rates.AZN * inputValue).toFixed(2)
      };
      console.log(convertedValues);
      rightInput.value = convertedValues[selectedValue];
      
      const conversionRate = data.conversion_rates[selectedValue];
      if (!conversionRate) {
        throw new Error('Conversion rate not available');
      }
      const convertedValue = (inputValue * conversionRate).toFixed(2);
      rightInput.value = convertedValue;
      
      let conversionInfo = '';

      if (currentValue === selectedValue) {
        switch (currentValue) {
          case 'AZN':
            conversionInfo = '1 AZN = 1 AZN';
            break;
          case 'EUR':
            conversionInfo = '1 EUR = 1 EUR';
            break;
          case 'USD':
            conversionInfo = '1 USD = 1 USD';
            break;
          case 'RUB':
            conversionInfo = '1 RUB = 1 RUB';
            break;
          default:
            break;
        }
      } else {
        conversionInfo =  `1 ${currentValue} = ${conversionRate.toFixed(3)} ${selectedValue}`;
      }

      rightInput.placeholder = `1 ${currentValue} = ${conversionRate.toFixed(3)} ${selectedValue}`;
      document.querySelector('.conversion-rate-info').textContent = conversionInfo;
    })
    .catch(error => {
      console.error(error);
      showAlert('Something went wrong. Please try again later.');
    });
};

const showAlert = (message) => {
  const errorDiv = document.querySelector('.error-message');
  errorDiv.textContent = message;
  setTimeout(() => {
    errorDiv.textContent = '';
  }, 0); 
};

const updateConversionRight = () => {
  const inputValue = parseFloat(rightInput.value) || 0;
  const url = `https://v6.exchangerate-api.com/v6/0891076ce69498770fe876d1/latest/${selectedValue}`; 

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      return response.json();
    })
    .then(data => {
      if (!data.conversion_rates) {
        throw new Error('Invalid response from server');
      }
      const convertedValues = {
        RUB: (inputValue * data.conversion_rates.RUB).toFixed(2),
        EUR: (inputValue * data.conversion_rates.EUR).toFixed(2),
        USD: (inputValue * data.conversion_rates.USD).toFixed(2),
        AZN: (inputValue * data.conversion_rates.AZN).toFixed(2)
      };
      console.log(convertedValues);
      leftInput.value = convertedValues[currentValue];
    })
    .catch(error => {
      console.error(error);
      alert('Something went wrong. Please try again later.');
    });
};


const toggleActiveClass = (buttons, activeButton, input) => {
  buttons.forEach(button => {
    button.classList.remove('active');
    button.style.color = "#C6C6C6";
    button.style.backgroundColor = '#fff';
  });
  activeButton.classList.add('active');
  activeButton.style.color = "#fff";
  activeButton.style.backgroundColor = "#833AE0";

  const newSelectedValue = activeButton.innerHTML;
  if (newSelectedValue !== selectedValue) {
    selectedValue = newSelectedValue;
    updateConversion();
  }
};

oneBoxButtons.forEach(button => {
  button.addEventListener('click', () => {
    const newCurrentValue = button.innerHTML;
    if (newCurrentValue !== currentValue) { 
      currentValue = newCurrentValue;
      updateConversion();
      toggleActiveClass(oneBoxButtons, button, leftInput);
    }
  });
});

twoBoxButtons.forEach(button => {
  button.addEventListener('click', () => {
    toggleActiveClass(twoBoxButtons, button, rightInput);
  });
});

leftInput.addEventListener('input', updateConversion);

leftInput.addEventListener('keydown', (event) => {
  if (!isNumericInput(event)) {
    event.preventDefault();
  }
});

leftInput.addEventListener('input', () => {

  if (leftInput.value.startsWith('0') && leftInput.value.length > 1) {
    leftInput.value = leftInput.value.slice(1);
  }
  leftInput.value = leftInput.value.replace(',', '.');
});


[leftInput].forEach(input => {
  input.addEventListener('input', () => {
    if (input.value === '.') {
      input.value = '0.';
    }
    input.value = input.value.replace(/(\.\d*)\./g, '$1');
  });
});

const isNumericInput = (event) => {
  const key = event.key;
  return (
    (key >= '0' && key <= '9') ||  
    key === '.' || key === ',' ||
    key === 'Delete' || key === 'Backspace' || 
    key === 'ArrowLeft' || key === 'ArrowRight' 
  );
};