document.addEventListener('DOMContentLoaded', () => {  //getting elements by id for form and results
  const form = document.getElementById('holiday_form');
  const results = document.getElementById('holidayResults');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); //clearing default view before showing results

    const country = document.getElementById('country').value; // Getting value of Country
    const year = document.getElementById('year').value; //Getting year from the form

    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`; // using API provided in the datenager (NOTE: this is from the Documentation)

    // Setting try catch block to get proper error message whenever an error is occurred 
    try {
      const response = await fetch(url); //fetch request stored in response 
      if (!response.ok) throw new Error('Network error'); //checking Network error, if response is 200 then continue the inner part else show error

      const holidays = await response.json(); //getting json response and storing it in holidays constant
      displayHolidays(holidays, country); //Calling function displayHolidays
    } catch (err) {
        //Displaying error if getting error in the call
      results.innerHTML = `<p class="error"> Could not fetch holidays. Please try again later.</p>`;
      console.error(err); //Displaying error in console to check the error code
    }
  });

  // This function will take holidays and country code
  function displayHolidays(holidays, countryCode) {
    results.innerHTML = ''; //Clearing the results before showing the actual response 

    if (!holidays || holidays.length === 0) {
      results.innerHTML = '<p>No holidays found.</p>'; // If there are no holidays showing message No Holidays found 
      return;
    }

    //Applying for each for each response from the API call
    holidays.forEach((holiday) => {

        // Using a constant for formatting the date, using Date function, that helps us to format data into Date format
      const dateFormatted = new Date(holiday.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      

      // Using FlagsAPI for showing the Flag of the country
      const flagURL = `https://flagsapi.com/${countryCode}/flat/64.png`;

      const card = document.createElement('div'); // Creating div element to display the record in card format
      card.classList.add('holiday-card'); // adding data in the card
      card.innerHTML = `
        <div class="holiday-header">
          <img src="${flagURL}" alt="${countryCode} flag" class="flag" />
          <h3>${holiday.name}</h3>
        </div>
        <p><strong>Date:</strong> ${dateFormatted}</p>
        <p><strong>Local Name:</strong> ${holiday.localName}</p>
        <p><strong>Type:</strong> ${holiday.types?.[0] || "Public"}</p>
        <hr />
      `;
      results.appendChild(card); // using AppendChild, so all the record will be appended to results
    });
  }
});
