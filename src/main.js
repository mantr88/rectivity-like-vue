let activeEffect;

const targetMap = new Map();

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);

    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }

    dep.add(activeEffect);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

function ref(initialValue) {
  const r = {
    get value() {
      track(r, 'value');
    },

    set value(newValue) {
      initialValue = newValue;
      trigger(r, 'value');
    },
  };

  return r;
}



function effect(fn) {
  const effect = () => {
    activeEffect = effect;
    try {
      fn();
    } finally {
      activeEffect = null;
    }
  };
  effect();
  return effect;
}

const count = ref(0);
console.log(`Count init: ${count.value}`);
// Create an effect to update the DOM when count changes
effect(() => {
  document.getElementById(
    "count-display"
  ).textContent = `Count: ${count.value}`;
});

// Event listeners for buttons
document.getElementById("increment").addEventListener("click", () => {
  count.value++;
});

document.getElementById("decrement").addEventListener("click", () => {
  count.value--;
});

document.getElementById("reset").addEventListener("click", () => {
  count.value = 0;
});
// Log the count when it changes
effect(() => {
  console.log(`Count: ${count.value}`);
});

// Simulate button clicks
function increment() {
  count.value++;
}
function decrement() {
  count.value--;
}
function reset() {
  count.value = 0;
}
// Example usage
// increment(); // Logs: Count: 1
// increment(); // Logs: Count: 2
// decrement(); // Logs: Count: 1
// reset(); // Logs: Count: 0
