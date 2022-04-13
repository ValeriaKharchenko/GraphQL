const colors = [
  '#FFC312',
  '#C4E538',
  '#12CBC4',
  '#FDA7DF',
  '#ED4C67',
  '#F79F1F',
  '#A3CB38',
  '#1289A7',
  '#D980FA',
  '#B53471',
  '#EE5A24',
  '#009432',
  '#0652DD',
  '#9980FA',
  '#833471',
  '#EA2027',
  '#006266',
  '#1B1464',
  '#5758BB',
  '#6F1E51',
];

const initColorGetter = (c) => {
  let i = Math.floor(Math.random() * c.length);
  return (n = 0) =>
    !n ? c[i++ % c.length] : [...Array(n)].map(() => c[i++ % c.length]);
};

const getColor = initColorGetter(colors);

console.log(getColor(), getColor());

export function SetPie(id, skills, title) {
  const canvas = document.getElementById(id);
  const data = {
    labels: Object.keys(skills),
    datasets: [
      {
        data: Object.values(skills),
        backgroundColor: getColor(6),
      },
    ],
  };

  const chart = new Chart(canvas, {
    // label: 'Current skills',
    type: 'pie',
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 20,
            weight: 'bold',
          },
        },
      },
    },
  });
}

export function SetLine(id, ob, title) {
  const sorted = Object.values(ob).sort((a, b) => {
    const aD = new Date(a.createdAt);
    const bD = new Date(b.createdAt);
    return aD.getTime() - bD.getTime();
  });

  const tasks = sorted.map((s) => s.name);
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
        borderColor: getColor(),
        hoverBackgroundColor: '#000000',
      },
    ],
  };

  const chart = new Chart(canvas, {
    type: 'line',
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 30,
            weight: 'bold',
          },
        },
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

export function SetBar(id, d, title) {
  const canvas = document.getElementById(id);
  const arrData = {};
  Object.keys(d).forEach((k) => {
    d[k].forEach((v1) => {
      if (!arrData[v1.type]) {
        arrData[v1.type] = {
          label: v1.type,
          data: [],
          backgroundColor: getColor(),
        };
      }
      arrData[v1.type].data.push({ x: k, y: v1.amount });
    });
  });

  const data = {
    labels: Object.keys(d),
    datasets: Object.values(arrData),
  };
  const chart = new Chart(canvas, {
    type: 'bar',
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 40,
            weight: 'bold',
          },
        },
      },
    },
  });
}
