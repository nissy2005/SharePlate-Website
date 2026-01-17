document.addEventListener('DOMContentLoaded', () => {
  // Get the forms
  const userLoginForm = document.getElementById('login-form');
  const userSignupForm = document.getElementById('signup-form');

  // User Login
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (email && password) {
        console.log('User login:', email, password);
        alert('Login successful!'); 
      } else {
        alert('Please enter email and password.');
      }
    });
  }

  // User SignUp
  if (userSignupForm) {
    userSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      if (email && password) {
        console.log('User signup:', email, password);
        alert('Signup successful!');
      } else {
        alert('Please enter email and password.');
      }
    });
  }
});