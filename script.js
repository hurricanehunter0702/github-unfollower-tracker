document.addEventListener('DOMContentLoaded', function () {
  var checkButton = document.getElementById('checkButton');
  var resultContainer = document.getElementById('resultContainer');
  var accessToken = '';
  var username = '';

  let nextPageLink

  function fetchFollowing(url, followingUsernames = []) {
    return fetch(url, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        nextPageLink = getNextPageLink(response.headers.get('Link'));
        return response.json();
      })
      .then((following) => {
        const pageUsernames = following.map((user) => user.login);
        followingUsernames.push(...pageUsernames);
        if (nextPageLink) {
          return fetchFollowing(nextPageLink, followingUsernames);
        }
        return followingUsernames;
      });
  }

  function fetchFollowers(url, followerUsernames = []) {
    return fetch(url, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network resonse was not ok while fetching followers.');
        }
        nextPageLink = getNextPageLink(response.headers.get('Link'));
        return response.json();
      })
      .then((follower) => {
        const _pageUsernames = follower.map((user) => user.login);
        followerUsernames.push(..._pageUsernames);
        if (nextPageLink) {
          return fetchFollowers(nextPageLink, followerUsernames);
        }
        return followerUsernames;
      })
  }

  function getNextPageLink(linkHeader) {
    if (!linkHeader) {
      return null;
    }
    const links = linkHeader.split(', ');
    const nextLink = links.find((link) => link.includes('rel="next"'));
    if (!nextLink) {
      return null;
    }
    return nextLink.split(';')[0].slice(1, -1);
  }


  checkButton.addEventListener('click', async function () {
    resultContainer.innerHTML = 'Checking...';
    fetchFollowing(`https://api.github.com/users/${username}/following`)
      .then((followingList) => {
        console.log('followingLinst=============>===========>', followingList)
        // Fetch the list of users following you
        fetchFollowers(`https://api.github.com/users/${username}/followers`)
          .then((followerList) => {
            console.log('followerList=============>===========>', followerList)
            var notFollowingBack = followingList.filter(user => !followerList.includes(user));
            if (notFollowingBack.length > 0) {
              resultContainer.innerHTML = notFollowingBack.join(', ');
            } else {
              resultContainer.innerHTML = 'Congratulations! All users you follow are following you back.';
            }
          })
          .catch(error => {
            resultContainer.innerHTML = 'An error occurred while fetching the followers list.';
            console.error(error);
          });
      })
      .catch((error) => {
        console.error('There was a problem fetching the data:', error);
      });
  });
});