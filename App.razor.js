/**
 * 第1引数に指定されたペインの集合を再帰的に検索し、第2引数に指定された contentId を
 * 持つペインのレイアウトオブジェクトを探し出して返します。見つからない場合は null が返ります。
 * @param {DockManagerPane[]} panes
 * @param {string} contentId
 * @returns {DockManagerPane|null}
 */
const findPane = (panes, contentId) => {
  for (const pane of panes) {
    if (pane.type === "contentPane") { if (pane.contentId === contentId) return pane; }
    else if (typeof (pane.panes) !== "undefined") {
      return findPane(pane.panes, contentId);
    }
  }
  return null;
}

/**
 * 第1引数に指定された CSS セレクタで指定される要素の中から、igc-dockmanager 要素を探し出し、
 * 第2引数に指定された contentId を持つペインを最大化します。第2引数 contentId に null を指定
 * した場合は、最大化を解除します。
 * @param {string} dockManagerContainerSelector
 * @param {string|null} contentId
 */
export const setMaximizedPane = (dockManagerContainerSelector, contentId) => {

  // 操作対象の igc-dockmanager 要素を探し当てます
  const dockManagerContainer = document.querySelector(dockManagerContainerSelector);
  const dockManager = dockManagerContainer?.querySelector("igc-dockmanager");

  // contentId に null を指定された場合は、DockManager の maximizedPane プロパティに null を設定することで、最大化を解除します。
  if (contentId === null) dockManager.maximizedPane = null;

  else {
    // DockManager の layout プロパティ以下にツリー構造で格納されているレイアウトオブジェクト群から、
    // 目的の contentId を持つペインのレイアウトオブジェクトを探し出します。
    const panes = [...(dockManager.layout.rootPane?.panes || []), ...(dockManager.layout.floatingPanes || [])];
    const pane = findPane(panes, contentId);

    // 最大化対象のレイアウトオブジェクトが見つかったら、いったん、DockManager のアクティブ化と最大化を確実に解除してから、
    // 対象のレイアウトオブジェクトをアクティブ化して、それから、最大化ペインに指定することで、確実に最大化します。
    if (pane !== null) {
      dockManager.maximizedPane = null;
      dockManager.activePane = null;
      dockManager.activePane = pane;
      dockManager.maximizedPane = pane;
    }
  }
}