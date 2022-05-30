const activeElement = document.querySelector(".active");
const scrollElement = document.querySelector("#to-top");
const lists = document.querySelectorAll("nav ul li");

scrollElement.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.scrollIntoView({
    behavior: "smooth",
  });
});

lists.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    [...lists].map((list) => list.classList.remove("active"));
    item.classList.add("active");
    let target = item.querySelector("a").getAttribute("href").replace("#", "");
    document.getElementById(target).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    let scrollTimeout;
    addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.querySelector(".active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    });
  });
});
