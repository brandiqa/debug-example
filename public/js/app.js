window.addEventListener('load', () => {
  const el = $('#app');

  const places = [];
  // const table = $('#places-table'); // 1. Empty Table BUG

  const placesFormTemplate = Handlebars.compile($('#places-form-template').html());
  const placesTableTemplate = Handlebars.compile($('#places-table-template').html());
  const convertTemplate = Handlebars.compile($('#convert-template').html());

  const addPlace = (city, country) => {
    // const id = ++places.length; // 2. Incorrect Increment Bug
    const id = places.length + 1;
    const numType = (id % 2 === 0) ? 'even' : 'odd';
    places.push({
      id, city, country, numType,
    });
  };

  addPlace('Nairobi', 'Kenya');

  const api = axios.create({
    baseURL: 'https://free.currencyconverterapi.com/api/v5',
    timeout: 5000,
  });

  const router = new Router({
    mode: 'history',
    page404: (path) => {
      const html = `Page '${path}' NOT Found!`;
      el.html(html);
    },
  });

  router.add('/', () => {
    const html = placesFormTemplate();
    el.html(html);
    // Form Validation Rules
    $('.ui.form').form({
      fields: {
        city: 'empty',
        country: 'empty',
      },
    });
    const placesTable = $('#places-table');
    const tableHtml = placesTableTemplate({ places });
    placesTable.html(tableHtml); // TODO : Remove this to recreate bug
    $('.submit').on('click', () => {
      const city = $('#city').val();
      const country = $('#country').val();
      addPlace(city, country);
      placesTable.html(placesTableTemplate({ places }));
      $('form').form('clear');
      return false;
    });
  });

  // Perform POST request, calculate and display conversion results
  const getConversionResults = async () => {
    // Extract form data
    const from = $('#from').val();
    const to = $('#to').val();
    const amount = $('#amount').val();
    // Send post data to express(proxy) server
    try {
      const response = await api.get(`/convert?q=${from}_${to}&compact=y`);
      const key = Object.keys(response.data)[0];
      const { val } = response.data[key];
      const result = val * amount;
      $('#result').html(`${to} ${result}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      $('#result-segment').removeClass('loading');
    }
  };

  const convertHandler = () => {
    if ($('.ui.form').form('is valid')) {
      // hide error message
      $('.ui.error.message').hide();
      // Post to express server
      $('#result-segment').addClass('loading');
      getConversionResults();
      // Prevent page from submitting to server
      return false;
    }
    return true;
  }

  router.add('/convert', async () => {
    let html = convertTemplate();
    el.html(html);
    // Fetch all Currencies
    try {
      const response = await api.get('/currencies');
      const { results } = response.data;
      html = convertTemplate({ results });
      el.html(html);
      $('.loading').removeClass('loading');
      $('.ui.form').form({
        fields: {
          from: 'empty',
          to: 'empty',
          amount: 'decimal',
        },
      });
      // Specify Submit Handler
      $('.submit').on('click', convertHandler);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  // const path = window.location.path; BUG 3
  router.navigateTo(window.location.pathname);

  // Navigate to clicked route
  $('a').on('click', (event) => {
    // Block page load
    event.preventDefault();

    // Highlight Active Menu on Click
    const target = $(event.target);
    $('.item').removeClass('active');
    target.addClass('active');

    // Navigate to clicked url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  });
});
