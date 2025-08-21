// Get current year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth-scroll back button
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const tgt = document.querySelector(a.getAttribute("href"));
        if (tgt) {
            e.preventDefault();
            tgt.scrollIntoView({ behavior: "smooth" });
        }
    });
});
