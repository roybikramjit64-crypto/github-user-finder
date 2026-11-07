const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioEl = document.getElementById("bio");
const locationEl = document.getElementById("location");
const joinedDateEl = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyEl = document.getElementById("company");
const blogEl = document.getElementById("blog");
const twitterEl = document.getElementById("twitter");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const twitterContainer = document.getElementById("twitter-container");
const reposContainer = document.getElementById("repos-container");

searchBtn.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchUser();
});

async function searchUser() {
    const username = searchInput.value.trim();

    if (!username) return alert("Please enter a username");

    try {
        //reset ui
        profileContainer.classList.add("hidden");
        errorContainer.classList.add("hidden");

        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error("User not found");

        const userData = await response.json();
        console.log("user data is here", userData);

        displayUserData(userData);

        fetchRepositories(userData.repos_url);
    } catch (error) {
        showError();
    }
}

async function fetchRepositories(repoUrl) {
    reposContainer.innerHTML = '<div class="loading-repos">Loading repositories...</div>';

    try {
        const response = await fetch(repoUrl + "?per_page=6");
        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        reposContainer.innerHTML = `<div class="no-repos">${error.message}</div>`;
    }
}

function displayRepos(repos) {
    if (repos.length === 0) {
        reposContainer.innerHTML = '<div class="no-repos">No repositories found</div>';
        return;
    }

    reposContainer.innerHTML = "";

    repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";

        const updateAt = formatDate(repo.updated_at);

        repoCard.innerHTML = `
            <a href="${repo.html_url}" target="_blank" class="repo-name">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L208 352L208 422.7C236.3 435 256 463.2 256 496C256 540.2 220.2 576 176 576C131.8 576 96 540.2 96 496C96 463.2 115.7 435 144 422.7L144 217.4C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168C477.3 168 488 157.3 488 144zM176 520C189.3 520 200 509.3 200 496C200 482.7 189.3 472 176 472C162.7 472 152 482.7 152 496C152 509.3 162.7 520 176 520z"/></svg>
            </a>
            <p class="repo-description">${repo.description || "No description available"}</p>
            <div class="repo-meta">
                ${
                    repo.language
                        ? `
                    <div class="repo-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/></svg> ${repo.language}
                    </div>
                    ` : ""
                }
                <div class="repo-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg> ${repo.stargazers_count}
                </div>
                <div class="repo-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 240C208 266.5 229.5 288 256 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L352 352L352 422.7C380.3 435 400 463.2 400 496C400 540.2 364.2 576 320 576C275.8 576 240 540.2 240 496C240 463.2 259.7 435 288 422.7L288 352L256 352C194.1 352 144 301.9 144 240L144 217.3C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM464 168C477.3 168 488 157.3 488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168zM344 496C344 482.7 333.3 472 320 472C306.7 472 296 482.7 296 496C296 509.3 306.7 520 320 520C333.3 520 344 509.3 344 496z"/></svg> ${repo.forks_count}
                </div>
                <div class="repo-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M320 128C426 128 512 214 512 320C512 426 426 512 320 512C254.8 512 197.1 479.5 162.4 429.7C152.3 415.2 132.3 411.7 117.8 421.8C103.3 431.9 99.8 451.9 109.9 466.4C156.1 532.6 233 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C234.3 64 158.5 106.1 112 170.7L112 144C112 126.3 97.7 112 80 112C62.3 112 48 126.3 48 144L48 256C48 273.7 62.3 288 80 288L104.6 288C105.1 288 105.6 288 106.1 288L192.1 288C209.8 288 224.1 273.7 224.1 256C224.1 238.3 209.8 224 192.1 224L153.8 224C186.9 166.6 249 128 320 128zM344 216C344 202.7 333.3 192 320 192C306.7 192 296 202.7 296 216L296 320C296 326.4 298.5 332.5 303 337L375 409C384.4 418.4 399.6 418.4 408.9 409C418.2 399.6 418.3 384.4 408.9 375.1L343.9 310.1L343.9 216z"/></svg> ${updateAt}
                </div>
            </div>
        
        `;
        reposContainer.appendChild(repoCard);
    });

    
}

function displayUserData(user) {
    avatar.src = user.avatar_url;
    nameElement.textContent = `@${user.login}`;
    bioEl.textContent = user.bio || "No bio available";

    locationEl.textContent = user.location || "Not specified";
    joinedDateEl.textContent = formatDate(user.created_at);

    profileLink.href = user.html_url;
    followers.textContent = user.followers;
    following.textContent = user.following;
    repos.textContent = user.public_repos;

    if (user.company) companyEl.textContent = user.company;
    else companyEl.textContent = "Not specified";

    if (user.blog) {
        blogEl.textContent = user.blog;
        blogEl.href = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
    } else {
        blogEl.textContent = "No website";
        blogEl.href = "#";
    }

    blogContainer.style.display = "flex";

    if (user.twitter_username) {
        twitterEl.textContent = `@${user.twitter_username}`;
        twitterEl.href = `https://twitter.com/${user.twitter_username}`;
    } else {
        twitterEl.textContent = "No Twitter";
        twitterEl.href = "#";
    }

    twitterContainer.style.display = "flex";
    profileContainer.classList.remove("hidden");
}

function showError() {
    errorContainer.classList.remove("hidden");
    profileContainer.classList.add("hidden");
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

searchInput.value = "burakorkmez";
searchUser();