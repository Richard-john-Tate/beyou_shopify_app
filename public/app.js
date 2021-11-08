const target = document.querySelector(".rich-text__text.rte");
const pageInput = document.createElement("input");
pageInput.setAttribute("type", "text");
pageInput.setAttribute("placeholder", "Enter batch number");
pageInput.setAttribute("id", "page-input");
target.appendChild(pageInput);

const getData = async () => {
  const response = await fetch(
    `https://2cca-62-249-245-66.ngrok.io/api/v1/reports/batchID/${pageInput.value}`
  );
  const data = await response.json();
  const report = data[0];
  const reportText = document.createElement("div");
  reportText.style.width = "500px";
  reportText.style.height = "200px";
  reportText.style.margin = "1rem auto";
  reportText.style.display = "flex";
  reportText.style.flexDirection = "column";
  reportText.style.justifyContent = "center";
  reportText.style.alignItems = "center";
  reportText.style.backgroundColor = "#f5f5f5";
  reportText.innerHTML = `<p>${report.certificates}</p>
        <p>${report.batchId}</p>

    `;
  target.appendChild(reportText);
};

pageInput.addEventListener("input", (e) => {
  e.preventDefault();
  if (pageInput.value.length === 0) {
    return;
  } else {
    getData();
  }
});
