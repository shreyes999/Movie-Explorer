const apiKey = "99f0222b78a735aebdf7e104bd6f2dd4";
const baseUrl = "https://api.themoviedb.org/3";
const allData = baseUrl + "/trending/all/day";
const url = `${allData}?sort_by=popularity.desc&api_key=${apiKey}`;
const trendWeek = `${baseUrl}/trending/all/week?&page=1&api_key=${apiKey}`;

const imagUrl = "https://image.tmdb.org/t/p/";

let currentPage = 1;
let totalPages = 1;
let lastUrl = url;
const totalNeeded = 20;

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const page = document.getElementById("current");

const mainOne = document.getElementById("Special");
const customCar = document.getElementById("inner");
const carousel = document.getElementById("front");
const head = document.getElementById("head");
const submitbtn = document.getElementById("submitbtn");

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

cardMovies(currentPage);

function getPagedUrl(page) {
  try {
    const url = new URL(lastUrl);
    url.searchParams.set("page", page);
    return url.toString();
  } catch (e) {
    let base = lastUrl.replace(/(&|\?)page=\d+/, "");
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}page=${page}`;
  }
}

function cardMovies(page = 1) {
  const fetchUrl = getPagedUrl(page);
  mainOne.innerHTML = "";
  fetch(fetchUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Could not fetch resource");
      return res.json();
    })
    .then((data) => {
      totalPages = data.total_pages;

      head.innerHTML = "Now Playing";
      head.className = "section-heading h2";
      data.results.forEach((element) => {
        cardlayout(element);
      });

      updatePageDisplay();
    })
    .catch((err) => {
      console.error(err);
      mainOne.innerHTML = `<p>Error loading movies.</p>`;
    });
}

function updatePageDisplay() {
  page.textContent = `Page ${currentPage} of ${totalPages}`;
  prev.classList.toggle("disabled", currentPage <= 1);
  next.classList.toggle("disabled", currentPage >= totalPages);
}

prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    cardMovies(currentPage);
  }
});

next.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    cardMovies(currentPage);
  }
});
console.log(submitbtn);

submitbtn.addEventListener("click", () => {
  const sname = document.getElementById("search").value.trim();
  console.log(sname);
  if (sname.length >= 1) {
    const searchName = searchid(sname);
    lastUrl = searchName;
    currentPage = 1;

    search(searchName);
  }
});

function searchid(sid) {
  return `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
    sid
  )}`;
}

function search(searchName) {
  carousel.innerHTML = "";
  mainOne.innerHTML = "";

  fetch(getPagedUrl(currentPage))
    .then((res) => {
      if (!res.ok) throw new Error("Could not fetch resource");
      return res.json();
    })
    .then((data) => {
      totalPages = data.total_pages;
      const head = document.getElementById("head");
      if (data.total_results > 0) {
        if (head) {
          head.innerHTML =
            "Results for: " + document.getElementById("search").value;
          head.className = "section-heading h2";
          head.style.textAlign = "";
        }
      } else {
        if (head) {
          head.innerHTML = "No Result";
          head.style.textAlign = "center";
        }
      }
      mainOne.innerHTML = "";
      data.results.forEach((element) => {
        cardlayout(element);
      });
      updatePageDisplay();
    })
    .catch((error) => {
      mainOne.innerHTML = `<p>Error loading search results.</p>`;
      console.error(error);
    });
}

function check(id) {
  let type = "";
  if (id === "mPopular") {
    type = `${baseUrl}/movie/popular?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "Popular Movies";
    head.className = "section-heading h2";
  } else if (id === "mNow_playing") {
    type = `${baseUrl}/movie/upcoming?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "Upcoming Movies";
    head.className = "section-heading h2";
  } else if (id === "mTop_rated") {
    type = `${baseUrl}/movie/top_rated?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "Top Rated Movies";
    head.className = "section-heading h2";
  } else if (id === "sPopular") {
    type = `${baseUrl}/tv/popular?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "Popular TV Shows";
    head.className = "section-heading h2";
  } else if (id === "sOn_tv") {
    type = `${baseUrl}/tv/on_the_air?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "On the Air TV Shows";
    head.className = "section-heading h2";
  } else if (id === "sTop_rated") {
    type = `${baseUrl}/tv/top_rated?language=en-US&api_key=${apiKey}`;
    head.innerHTML = "Top Rated TV Shows";
    head.className = "section-heading h2";
  } else {
    console.error("Invalid category id:", id);
    return;
  }

  lastUrl = type;
  currentPage = 1;
  sorted(type);
}
function fetchUpcomingMovies(page = 1, accumulated = []) {
  const urlPage = getPagedUrl(page);
  fetch(urlPage)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then((data) => {
      totalPages = data.total_pages;
      const today = new Date().toISOString().slice(0, 10);

      const upcoming = data.results.filter(
        (element) => element.release_date >= today
      );

      accumulated = accumulated.concat(upcoming);

      if (accumulated.length < totalNeeded && page < totalPages) {
        fetchUpcomingMovies(page + 1, accumulated);
      } else {
        mainOne.innerHTML = "";
        accumulated.slice(0, totalNeeded).forEach(cardlayout);
        updatePageDisplay();
      }
    })
    .catch((err) => {
      console.error(err);
      mainOne.innerHTML = `<p>Error loading upcoming movies.</p>`;
    });
}
function sorted(type) {
  lastUrl = type;
  currentPage = 1;
  carousel.innerHTML = "";
  mainOne.innerHTML = "";

  if (type.includes("upcoming")) {
    fetchUpcomingMovies(currentPage);
  } else {
    fetch(getPagedUrl(currentPage))
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch resource");
        return res.json();
      })
      .then((data) => {
        totalPages = data.total_pages;
        data.results.forEach((element) => cardlayout(element));
        updatePageDisplay();
      })
      .catch((err) => {
        console.error(err);
        mainOne.innerHTML = `<p>Error loading sorted movies.</p>`;
      });
  }
}

carsousel(trendWeek);
function carsousel(trendWeek) {
  fetch(trendWeek)
    .then((res) => {
      if (!res.ok) throw new Error("Could not fetch resource");
      return res.json();
    })
    .then((data) => {
      customCar.innerHTML = "";
      const divCar = document.createElement("div");
      divCar.className = "carousel-inner";

      data.results.forEach((element, index) => {
        const divActive = document.createElement("div");
        divActive.className =
          index === 0
            ? "carousel-item position-relative active"
            : "carousel-item position-relative";

        const banner = document.createElement("img");
        banner.className = "d-block w-100";
        banner.id = "banner";
        banner.src = imagUrl + "original" + element.backdrop_path;

        const carOverlay = document.createElement("div");
        carOverlay.className = "carousel-overlay";

        const carCard = document.createElement("div");
        carCard.className = "card";
        carCard.id = "carCard";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const logo = document.createElement("img");
        logo.id = "carLogo";

        const imgData = `${baseUrl}/${element.media_type}/${element.id}/images?include_image_language=${element.original_language}&api_key=${apiKey}`;

        getImages(imgData)
          .then((logoPath) => {
            if (logoPath) {
              logo.src = imagUrl + "original" + logoPath;
            } else {
              logo.style.display = "none";
            }
          })
          .catch((error) => {
            console.error(error);
            logo.style.display = "none";
          });

        const h5 = document.createElement("h5");
        h5.className = "card-details fw-light";

        const star = document.createElement("img");
        star.id = "star";
        let genIds = element.genre_ids;
        let genreNames = genres
          .filter((obj) => genIds.includes(obj.id))
          .map((obj) => obj.name);

        star.src =
          "https://toppng.com/uploads/thumbnail/red-star-logo-clear-background-11661162416op1uluj3tw.png";

        h5.innerHTML =
          element.vote_count > 0
            ? " " +
              element.vote_average.toPrecision(2) +
              "/10 " +
              genreNames.join(" ")
            : "No Rating yet" + genreNames.join(" ");

        const para = document.createElement("p");
        para.className = "card-text chars-limit";
        para.innerHTML = element.overview || "";

        divActive.appendChild(banner);
        divActive.appendChild(carOverlay);
        carOverlay.appendChild(carCard);
        carCard.appendChild(cardBody);
        cardBody.appendChild(logo);
        cardBody.appendChild(h5);
        h5.prepend(star);
        cardBody.appendChild(para);
        divCar.appendChild(divActive);
      });

      customCar.appendChild(divCar);
    })
    .catch((err) => {
      console.error(err);
      customCar.innerHTML = `<p>Error loading carousel.</p>`;
    });
}

function getImages(imgData) {
  return fetch(imgData)
    .then((res) => {
      if (!res.ok) throw new Error("Could not fetch image");
      return res.json();
    })
    .then((data) => {
      if (data.logos && data.logos.length > 0) {
        return data.logos[0].file_path;
      }
      return null;
    });
}

let overlayListenersInitialized = false;

function cardlayout(element) {
  const divCol = document.createElement("div");
  divCol.className = "col";
  divCol.setAttribute("data-id", element.id);
  divCol.style.cursor = "pointer";
  divCol.setAttribute("data-type", element.media_type);

  const img = document.createElement("img");
  img.className = "img-thumbnail";
  img.src = imagUrl + "w500" + element.poster_path;

  const details = document.createElement("div");
  details.className = "hidden";

  const title = document.createElement("h2");
  title.id = "card-t";
  title.innerHTML = element.title || element.name;

  const cardP = document.createElement("p");
  cardP.id = "card-p";

  const cardI = document.createElement("img");
  cardI.id = "card-i";
  cardI.src =
    "https://toppng.com/uploads/thumbnail/red-star-logo-clear-background-11661162416op1uluj3tw.png";

  cardP.innerHTML =
    element.vote_count > 0
      ? " " + element.vote_average.toPrecision(2) + "/10 "
      : "No Rating yet";

  divCol.appendChild(img);
  divCol.appendChild(details);
  details.appendChild(title);

  title.appendChild(cardP);
  cardP.prepend(cardI);

  mainOne.appendChild(divCol);

  if (!overlayListenersInitialized) {
    overlayListenersInitialized = true;

    let currentTrailers = [];
    let currentTrailerIndex = 0;

    const videoOverlay = document.getElementById("video-overlay");
    const videoPlayer = document.getElementById("video-player");
    const videoOverlayClose = document.getElementById("video-overlay-close");
    const leftArrow = document.getElementById("left-arrow");
    const rightArrow = document.getElementById("right-arrow");

    document.addEventListener("click", async (e) => {
      if (e.target === videoOverlayClose) {
        videoOverlay.style.display = "none";
        videoPlayer.src = "";
        return;
      }

      const col = e.target.closest(".col");
      if (!col) return;

      const id = col.getAttribute("data-id");
      const mediaType = col.getAttribute("data-type");
      if (!id || !mediaType) {
        alert("Missing media ID or type!");
        return;
      }

      try {
        const apiUrl = `${baseUrl}/${mediaType}/${id}/videos?language=en-US&api_key=${apiKey}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch trailer data");
        const data = await res.json();

        currentTrailers = data.results.filter(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );

        if (currentTrailers.length === 0) {
          alert("No trailers available for this title.");
          return;
        }

        currentTrailerIndex = 0;
        showTrailer();
        videoOverlay.style.display = "flex";
      } catch (err) {
        console.error(err);
        alert("Error loading trailer.");
      }
    });

    leftArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentTrailers.length === 0) return;
      currentTrailerIndex =
        (currentTrailerIndex - 1 + currentTrailers.length) %
        currentTrailers.length;
      showTrailer();
    });

    rightArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentTrailers.length === 0) return;
      currentTrailerIndex = (currentTrailerIndex + 1) % currentTrailers.length;
      showTrailer();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        videoOverlay.style.display = "none";
        videoPlayer.src = "";
      }
    });

    function showTrailer() {
      if (currentTrailers.length === 0) {
        videoPlayer.src = "";
        return;
      }
      videoPlayer.src = `https://www.youtube.com/embed/${currentTrailers[currentTrailerIndex].key}?autoplay=1`;
    }
  }
}
