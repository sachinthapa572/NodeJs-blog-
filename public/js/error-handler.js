function hideErrorMessage(errorMessageId = "error=msg", delay = 5000) {
  console.log("object");
  const errorMessage = document.getElementById(errorMessageId);
  console.log(errorMessage);
  if (errorMessage) {
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, delay);
  }
}
