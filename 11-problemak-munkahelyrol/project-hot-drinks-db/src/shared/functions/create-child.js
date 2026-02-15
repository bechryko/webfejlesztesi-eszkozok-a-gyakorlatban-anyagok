function createChild(parent, tagName, tagAttributes) {
  const child = document.createElement(tagName);
  for (const key in tagAttributes) {
    child[key] = tagAttributes[key];
  }
  parent.appendChild(child);
  return child;
}
