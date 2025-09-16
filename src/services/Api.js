
export async function fetchCountries() {
  const response = await fetch('http://localhost:5000/api/countries');
  return response.json();
}