const axios = require("axios");

const run = async () => {
  let isComplete = false;

  const per_page = 100;

  let page = 1;

  const branches = [];

  do {
    const { data } = await axios({
      method: "GET",
      url: "https://api.github.com/repos/soum-sa/soum-k8s/branches",
      params: {
        per_page,
        page,
      },
      headers: {
        Authorization: `Bearer ${process.env.CI_GITHUB_TOKEN}`,
      },
    });

    console.log(`Gotten ${data.length} branches`);

    branches.push(
      ...data.filter(({ protected }) => !protected).map(({ name }) => name)
    );

    if (data.length < per_page) {
      isComplete = true;
    }

    page += 1;
  } while (!isComplete);

  for (const branch of branches) {
    const { data } = await axios({
      method: "GET",
      url: `https://api.github.com/repos/soum-sa/soum-k8s/branches/${branch}`,
      headers: {
        Authorization: `Bearer ${process.env.CI_GITHUB_TOKEN}`,
      },
    });

    const now = new Date();

    const twoMonthsEarlier = new Date(now.setMonth(now.getMonth() - 2));

    if (
      new Date(data.commit.commit.author.date).getTime() >
      twoMonthsEarlier.getTime()
    ) {
      continue;
    }

    await axios({
      method: "DELETE",
      url: `https://api.github.com/repos/soum-sa/soum-k8s/git/refs/heads/${branch}`,
      headers: {
        Authorization: `Bearer ${process.env.CI_GITHUB_TOKEN}`,
      },
    });

    console.log(`Deleted branch: ${branch}`);
  }
};

run().then(() => {
  return process.exit(0);
});
