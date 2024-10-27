// TODO:
// FIX STATIC IP FETCH CALL, since raspberrypi ip is dynamically assigned

const maxTimerDisplayID = "max-time-display";
const feedButtonID = "feed-button";
const lastFeedingTimeID = "last-feeding-time-display";

const MAX_TIME = 3600 * 1000 * 4;

const maxTimerDisplay = document.getElementById(maxTimerDisplayID);
const newDate = new Date();
fetch("http://10.0.0.23:7300/")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    console.log(data.time);
    const lastFeedingTime = new Date(Number(data.time));
    lastFeedingTimeDisplay.textContent = lastFeedingTime.toLocaleString();
    console.log(lastFeedingTime);
    const updatedMax = lastFeedingTime.getTime() + MAX_TIME;
    const updateDate = new Date(updatedMax);
    maxTimerDisplay.textContent = updateDate.toLocaleString();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
// maxTimerDisplay.textContent = newDate.toLocaleString();
const feedButton = document.getElementById(feedButtonID);

const lastFeedingTimeDisplay = document.getElementById(lastFeedingTimeID);

feedButton.onclick = (e) => {
  const feedDate = new Date();
  fetch("http://10.0.0.23:7300/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: feedDate.getTime() }),
  })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  let updatedMax = feedDate.getTime() + MAX_TIME;
  const updateDate = new Date(updatedMax);
  maxTimerDisplay.textContent = updateDate.toLocaleString();
  lastFeedingTimeDisplay.textContent = feedDate.toLocaleString();
  //   console.log("timer updated");
};

const ctx = document.getElementById('myChart');

fetch("http://10.0.0.23:7300/data")
  .then((response) => response.json())
  .then(dataObj => {
    console.log(dataObj);

    const timestampsArr = dataObj.timestamps;

    const timestampsByHour = timestampsArr.map((timestamp) => {
      const date = new Date(Number(timestamp));
      return date.getHours();
    });

    // Group by hour
    const hourlyCounts = Array(24).fill(0);
    timestampsByHour.forEach(hour => {
      hourlyCounts[Math.floor(hour)] += 1;
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: '# of Feedings',
          data: hourlyCounts,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Feedings By Hour'
          }
        }
      }
    });

    // Convert timestamps to dates (YYYY-MM-DD)
    const dates = timestampsArr.map(ts => {
      const date = new Date(Number(ts));
      return date.toLocaleDateString(); // Get the date in YYYY-MM-DD format
    });

    // Count feedings per day
    const dailyCounts = {};
    dates.forEach(date => {
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Prepare the data for Chart.js
    const labels = Object.keys(dailyCounts);
    const data = Object.values(dailyCounts);

    // Create the chart
    const ctxDaily = document.getElementById('feedingChartDaily').getContext('2d');
    new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Feedings per Day',
          data: data,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Feedings'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Daily Feedings'
          }
        }
      }
    });

  });
