document.addEventListener('DOMContentLoaded', function () {
  var checkButton = document.getElementById('checkButton');
  var resultContainer = document.getElementById('resultContainer');

  checkButton.addEventListener('click', function () {
    resultContainer.innerHTML = 'Checking...';

    // Replace 'YOUR_ACCESS_TOKEN' with your actual GitHub personal access token
    var accessToken = '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';

    // Replace 'YOUR_USERNAME' with your GitHub username
    var username = 'hurricanehunter0702';

    var followingList = [];
    var followersList = [];

    // Fetch the list of users you are following
    fetch(`https://api.github.com/users/${username}/following`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(followingData => {
        followingList = followingData.map(user => user.login);

        // Fetch the list of users following you
        fetch(`https://api.github.com/users/${username}/followers`, {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })
          .then(response => response.json())
          .then(async (followersData) => {
            followersList = followersData.map(user => user.login);

            // Find users you are following but who are not following you back
            var notFollowingBack = followingList.filter(user => !followersList.includes(user));
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
      .catch(error => {
        resultContainer.innerHTML = 'An error occurred while fetching the following list.';
        console.error(error);
      });
  });
});