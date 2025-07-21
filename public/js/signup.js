document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    image: document.getElementById('image').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    language: document.getElementById('language').value,
    skills: document.getElementById('skills').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    portfolio: document.getElementById('portfolio').value,
    password: document.getElementById('password').value
  };

  const response = await fetch('/account/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  const result = await response.json();

  if (response.ok) {
    alert('Signup successful');
    // Redirect to login page
    window.location.href = '/login.html';
  } else {
    alert(result.message);
  }
});