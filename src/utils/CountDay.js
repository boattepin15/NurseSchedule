function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; 
  
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  

module.exports = daysInCurrentMonth