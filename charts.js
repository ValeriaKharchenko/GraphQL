export function SetPie(id, skills) {
  const canvas = document.getElementById(id);
  const data = {
    labels: Object.keys(skills),
    datasets: [
      {
        data: Object.values(skills),
        backgroundColor: [
          '#00CB4C',
          '#0239D5',
          '#F8D72D',
          '#E31A22',
          '#7B02A0',
          '#FF8C12',
        ],
      },
    ],
  };

  const chart = new Chart(canvas, {
    type: 'pie',
    data: data,
    options: {
      title: {
        display: true,
        text: 'Current skills',
      },
    },
  });
}

export function SetLine(id, ob) {
  const sorted = Object.values(ob).sort((a, b) => {
    const aD = new Date(a.createdAt);
    const bD = new Date(b.createdAt);
    return aD.getTime() - bD.getTime();
  });
  const tasks = sorted.map((s) => s.name);
  console.log('sorted:', sorted);
  const canvas = document.getElementById(id);
  const data = {
    labels: sorted.map((s) => {
      const d = new Date(s.createdAt);
      return `${withZero(d.getDate())}.${withZero(
        d.getMonth() + 1
      )}.${d.getFullYear()} ${withZero(d.getHours())}:${withZero(
        d.getMinutes()
      )}`;
    }),
    datasets: [
      {
        label: 'Attempts',
        data: sorted.map((s) => s.attempts),
        borderColor: '#00CB4C',
      },
    ],
  };

  const chart = new Chart(canvas, {
    type: 'line',
    data: data,
    options: {
      title: {
        display: true,
        text: 'Attempts',
      },
      plugins: {
        tooltip: {
          callbacks: {
            footer: (t) => {
              return 'Task: ' + capitalize(tasks[t[0].dataIndex]);
            },
          },
        },
      },
    },
  });
}

function withZero(input) {
  return input < 10 ? '0' + input : '' + input;
}
function capitalize(st) {
  return st.charAt(0).toUpperCase() + st.slice(1);
}
