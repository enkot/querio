try {
  browser.devtools.panels.create(
    'Querio',
    '/icons/16.png',
    'index.html',
  )
}
catch (e) {
  console.error(e)
}

export { }
