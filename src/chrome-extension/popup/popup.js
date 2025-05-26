const h1 = document.querySelector('h1')
h1.addEventListener('click', () => {
  alert(h1.innerHTML)
})

async function getCurrentTab() {
  const queryOptions = { active: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

async function click(e) {
  const color = e.target.id
  const activeTab = await getCurrentTab()
  chrome.scripting.executeScript({
    args: [color],
    target: { tabId: activeTab.id },
    func: (color) => {
      document.body.style.backgroundColor = `${color}`
    },
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const doms = document.querySelectorAll('div')
  for (let i = 0; i < doms.length; i++) {
    doms[i].addEventListener('click', click)
  }
})
