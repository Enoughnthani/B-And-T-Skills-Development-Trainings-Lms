export function isValidSouthAfricanID(id) {
  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(id)) return false;

  // 1️⃣ Validate date of birth
  const year = parseInt(id.substring(0, 2), 10);
  const month = parseInt(id.substring(2, 4), 10) - 1; // JS months 0-11
  const day = parseInt(id.substring(4, 6), 10);

  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year <= currentYear ? 2000 + year : 1900 + year;

  const dob = new Date(fullYear, month, day);
  if (
    dob.getFullYear() !== fullYear ||
    dob.getMonth() !== month ||
    dob.getDate() !== day
  ) {
    return false;
  }

  // 2️⃣ Citizenship digit (0 = SA citizen, 1 = permanent resident)
  const citizenship = id.charAt(10);
  if (citizenship !== "0" && citizenship !== "1") return false;

  // 3️⃣ Luhn checksum
  let sum = 0;
  let alternate = false;

  for (let i = id.length - 1; i >= 0; i--) {
    let n = parseInt(id.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}
