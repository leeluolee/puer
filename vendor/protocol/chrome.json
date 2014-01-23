// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var MIN_VERSION_TAB_CLOSE = 25;
var MIN_VERSION_TARGET_ID = 26;
var MIN_VERSION_NEW_TAB = 29;
var MIN_VERSION_TAB_ACTIVATE = 30;

function inspect(data) {
  chrome.send('inspect', [data]);
}

function activate(data) {
  chrome.send('activate', [data]);
}

function close(data) {
  chrome.send('close', [data]);
}

function reload(data) {
  chrome.send('reload', [data]);
}

function open(browserId, url) {
  chrome.send('open', [browserId, url]);
}

function removeChildren(element_id) {
  var element = $(element_id);
  element.textContent = '';
}

function onload() {
  var tabContents = document.querySelectorAll('#content > div');
  for (var i = 0; i != tabContents.length; i++) {
    var tabContent = tabContents[i];
    var tabName = tabContent.querySelector('.content-header').textContent;

    var tabHeader = document.createElement('div');
    tabHeader.className = 'tab-header';
    var button = document.createElement('button');
    button.textContent = tabName;
    tabHeader.appendChild(button);
    tabHeader.addEventListener('click', selectTab.bind(null, tabContent.id));
    $('navigation').appendChild(tabHeader);
  }
  var selectedTabName = window.location.hash.slice(1) || 'devices';
  selectTab(selectedTabName);
  initSettings();
  chrome.send('init-ui');
}

function selectTab(id) {
  var tabContents = document.querySelectorAll('#content > div');
  var tabHeaders = $('navigation').querySelectorAll('.tab-header');
  for (var i = 0; i != tabContents.length; i++) {
    var tabContent = tabContents[i];
    var tabHeader = tabHeaders[i];
    if (tabContent.id == id) {
      tabContent.classList.add('selected');
      tabHeader.classList.add('selected');
    } else {
      tabContent.classList.remove('selected');
      tabHeader.classList.remove('selected');
    }
  }
  window.location.hash = id;
}

function populateWebContentsTargets(data) {
  removeChildren('pages-list');
  removeChildren('extensions-list');
  removeChildren('apps-list');
  removeChildren('others-list');

  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 'page')
      addToPagesList(data[i]);
    else if (data[i].type === 'background_page')
      addToExtensionsList(data[i]);
    else if (data[i].type === 'app')
      addToAppsList(data[i]);
    else
      addToOthersList(data[i]);
  }
}

function populateWorkerTargets(data) {
  removeChildren('workers-list');

  for (var i = 0; i < data.length; i++)
    addToWorkersList(data[i]);
}

function populateRemoteTargets(devices) {
  if (!devices)
    return;

  if (window.modal) {
    window.holdDevices = devices;
    return;
  }

  function alreadyDisplayed(element, data) {
    var json = JSON.stringify(data);
    if (element.cachedJSON == json)
      return true;
    element.cachedJSON = json;
    return false;
  }

  function insertChildSortedById(parent, child) {
    for (var sibling = parent.firstElementChild;
                     sibling;
                     sibling = sibling.nextElementSibling) {
      if (sibling.id > child.id) {
        parent.insertBefore(child, sibling);
        return;
      }
    }
    parent.appendChild(child);
  }

  var deviceList = $('devices-list');
  if (alreadyDisplayed(deviceList, devices))
    return;

  function removeObsolete(validIds, section) {
    if (validIds.indexOf(section.id) < 0)
      section.remove();
  }

  var newDeviceIds = devices.map(function(d) { return d.adbGlobalId });
  Array.prototype.forEach.call(
      deviceList.querySelectorAll('.device'),
      removeObsolete.bind(null, newDeviceIds));

  for (var d = 0; d < devices.length; d++) {
    var device = devices[d];

    var deviceSection = $(device.adbGlobalId);
    if (!deviceSection) {
      deviceSection = document.createElement('div');
      deviceSection.id = device.adbGlobalId;
      deviceSection.className = 'device';
      deviceList.appendChild(deviceSection);

      var deviceHeader = document.createElement('div');
      deviceHeader.className = 'device-header';
      deviceSection.appendChild(deviceHeader);

      var deviceName = document.createElement('div');
      deviceName.className = 'device-name';
      deviceHeader.appendChild(deviceName);

      if (device.adbSerial) {
        var deviceSerial = document.createElement('div');
        deviceSerial.className = 'device-serial';
        deviceSerial.textContent = '#' + device.adbSerial.toUpperCase();
        deviceHeader.appendChild(deviceSerial);
      }

      var devicePorts = document.createElement('div');
      devicePorts.className = 'device-ports';
      deviceHeader.appendChild(devicePorts);

      var browserList = document.createElement('div');
      browserList.className = 'browsers';
      deviceSection.appendChild(browserList);

      var authenticating = document.createElement('div');
      authenticating.className = 'device-auth';
      deviceSection.appendChild(authenticating);
    }

    if (alreadyDisplayed(deviceSection, device))
      continue;

    deviceSection.querySelector('.device-name').textContent = device.adbModel;
    deviceSection.querySelector('.device-auth').textContent =
        device.adbConnected ? '' : 'Pending authentication: please accept ' +
          'debugging session on the device.';

    var devicePorts = deviceSection.querySelector('.device-ports');
    devicePorts.textContent = '';
    if (device.adbPortStatus) {
      for (var port in device.adbPortStatus) {
        var status = device.adbPortStatus[port];
        var portIcon = document.createElement('div');
        portIcon.className = 'port-icon';
        if (status > 0)
          portIcon.classList.add('connected');
        else if (status == -1 || status == -2)
          portIcon.classList.add('transient');
        else if (status < 0)
          portIcon.classList.add('error');
        devicePorts.appendChild(portIcon);

        var portNumber = document.createElement('div');
        portNumber.className = 'port-number';
        portNumber.textContent = ':' + port;
        if (status > 0)
          portNumber.textContent += '(' + status + ')';
        devicePorts.appendChild(portNumber);
      }
    }

    var browserList = deviceSection.querySelector('.browsers');
    var newBrowserIds =
        device.browsers.map(function(b) { return b.adbGlobalId });
    Array.prototype.forEach.call(
        browserList.querySelectorAll('.browser'),
        removeObsolete.bind(null, newBrowserIds));

    for (var b = 0; b < device.browsers.length; b++) {
      var browser = device.browsers[b];

      var isChrome = browser.adbBrowserProduct &&
          browser.adbBrowserProduct.match(/^Chrome/);

      var majorChromeVersion = 0;
      if (isChrome && browser.adbBrowserVersion) {
        var match = browser.adbBrowserVersion.match(/^(\d+)/);
        if (match)
          majorChromeVersion = parseInt(match[1]);
      }

      var pageList;
      var browserSection = $(browser.adbGlobalId);
      if (browserSection) {
        pageList = browserSection.querySelector('.pages');
      } else {
        browserSection = document.createElement('div');
        browserSection.id = browser.adbGlobalId;
        browserSection.className = 'browser';
        insertChildSortedById(browserList, browserSection);

        var browserHeader = document.createElement('div');
        browserHeader.className = 'browser-header';

        var browserName = document.createElement('div');
        browserName.className = 'browser-name';
        browserHeader.appendChild(browserName);
        if (browser.adbBrowserPackage && !isChrome)
          browserName.textContent = browser.adbBrowserPackage;
        else
          browserName.textContent = browser.adbBrowserProduct;
        if (browser.adbBrowserVersion)
          browserName.textContent += ' (' + browser.adbBrowserVersion + ')';
        browserSection.appendChild(browserHeader);

        if (majorChromeVersion >= MIN_VERSION_NEW_TAB) {
          var newPage = document.createElement('div');
          newPage.className = 'open';

          var newPageUrl = document.createElement('input');
          newPageUrl.type = 'text';
          newPageUrl.placeholder = 'Open tab with url';
          newPage.appendChild(newPageUrl);

          var openHandler = function(browserId, input) {
            open(browserId, input.value || 'about:blank');
            input.value = '';
          }.bind(null, browser.adbGlobalId, newPageUrl);
          newPageUrl.addEventListener('keyup', function(handler, event) {
            if (event.keyIdentifier == 'Enter' && event.target.value)
              handler();
          }.bind(null, openHandler), true);

          var newPageButton = document.createElement('button');
          newPageButton.textContent = 'Open';
          newPage.appendChild(newPageButton);
          newPageButton.addEventListener('click', openHandler, true);

          browserHeader.appendChild(newPage);
        }

        pageList = document.createElement('div');
        pageList.className = 'list pages';
        browserSection.appendChild(pageList);
      }

      if (alreadyDisplayed(browserSection, browser))
        continue;

      pageList.textContent = '';
      for (var p = 0; p < browser.pages.length; p++) {
        var page = browser.pages[p];
        // Attached targets have no unique id until Chrome 26. For such targets
        // it is impossible to activate existing DevTools window.
        page.hasNoUniqueId = page.attached &&
            majorChromeVersion < MIN_VERSION_TARGET_ID;
        var row = addTargetToList(page, pageList, ['name', 'url']);
        if (page['description'])
          addWebViewDetails(row, page);
        else
          addFavicon(row, page);
        if (isChrome) {
          if (majorChromeVersion >= MIN_VERSION_TAB_ACTIVATE) {
            addActionLink(row, 'focus tab', activate.bind(null, page), false);
          }
          addActionLink(row, 'reload', reload.bind(null, page), page.attached);
          if (majorChromeVersion >= MIN_VERSION_TAB_CLOSE) {
            addActionLink(
                row, 'close', close.bind(null, page), page.attached);
          }
        }
      }
    }
  }
}

function addToPagesList(data) {
  var row = addTargetToList(data, $('pages-list'), ['name', 'url']);
  addFavicon(row, data);
}

function addToExtensionsList(data) {
  var row = addTargetToList(data, $('extensions-list'), ['name', 'url']);
  addFavicon(row, data);
}

function addToAppsList(data) {
  var row = addTargetToList(data, $('apps-list'), ['name', 'url']);
  addFavicon(row, data);
  if (data.guests) {
    Array.prototype.forEach.call(data.guests, function(guest) {
      var guestRow = addTargetToList(guest, row, ['name', 'url']);
      guestRow.classList.add('guest');
      addFavicon(guestRow, guest);
    });
  }
}

function addToWorkersList(data) {
  var row =
      addTargetToList(data, $('workers-list'), ['name', 'description', 'url']);
  addActionLink(row, 'terminate', close.bind(null, data), data.attached);
}

function addToOthersList(data) {
  addTargetToList(data, $('others-list'), ['url']);
}

function formatValue(data, property) {
  var value = data[property];

  if (property == 'name' && value == '') {
    value = 'untitled';
  }

  var text = value ? String(value) : '';
  if (text.length > 100)
    text = text.substring(0, 100) + '\u2026';

  var span = document.createElement('div');
  span.textContent = text;
  span.className = property;
  return span;
}

function addFavicon(row, data) {
  var favicon = document.createElement('img');
  if (data['faviconUrl'])
    favicon.src = data['faviconUrl'];
  row.insertBefore(favicon, row.firstChild);
}

function addWebViewDetails(row, data) {
  var webview;
  try {
    webview = JSON.parse(data['description']);
  } catch (e) {
    return;
  }
  addWebViewDescription(row, webview);
  if (data.adbScreenWidth && data.adbScreenHeight)
    addWebViewThumbnail(
        row, webview, data.adbScreenWidth, data.adbScreenHeight);
}

function addWebViewDescription(row, webview) {
  var viewStatus = { visibility: '', position: '', size: '' };
  if (!webview.empty) {
    if (webview.attached && !webview.visible)
      viewStatus.visibility = 'hidden';
    else if (!webview.attached)
      viewStatus.visibility = 'detached';
    viewStatus.size = 'size ' + webview.width + ' \u00d7 ' + webview.height;
  } else {
    viewStatus.visibility = 'empty';
  }
  if (webview.attached) {
      viewStatus.position =
        'at (' + webview.screenX + ', ' + webview.screenY + ')';
  }

  var subRow = document.createElement('div');
  subRow.className = 'subrow webview';
  if (webview.empty || !webview.attached || !webview.visible)
    subRow.className += ' invisible-view';
  if (viewStatus.visibility)
    subRow.appendChild(formatValue(viewStatus, 'visibility'));
  subRow.appendChild(formatValue(viewStatus, 'position'));
  subRow.appendChild(formatValue(viewStatus, 'size'));
  var mainSubrow = row.querySelector('.subrow.main');
  if (mainSubrow.nextSibling)
    mainSubrow.parentNode.insertBefore(subRow, mainSubrow.nextSibling);
  else
    mainSubrow.parentNode.appendChild(subRow);
}

function addWebViewThumbnail(row, webview, screenWidth, screenHeight) {
  var maxScreenRectSize = 50;
  var screenRectWidth;
  var screenRectHeight;

  var aspectRatio = screenWidth / screenHeight;
  if (aspectRatio < 1) {
    screenRectWidth = Math.round(maxScreenRectSize * aspectRatio);
    screenRectHeight = maxScreenRectSize;
  } else {
    screenRectWidth = maxScreenRectSize;
    screenRectHeight = Math.round(maxScreenRectSize / aspectRatio);
  }

  var thumbnail = document.createElement('div');
  thumbnail.className = 'webview-thumbnail';
  var thumbnailWidth = 3 * screenRectWidth;
  var thumbnailHeight = 60;
  thumbnail.style.width = thumbnailWidth + 'px';
  thumbnail.style.height = thumbnailHeight + 'px';

  var screenRect = document.createElement('div');
  screenRect.className = 'screen-rect';
  screenRect.style.left = screenRectWidth + 'px';
  screenRect.style.top = (thumbnailHeight - screenRectHeight) / 2 + 'px';
  screenRect.style.width = screenRectWidth + 'px';
  screenRect.style.height = screenRectHeight + 'px';
  thumbnail.appendChild(screenRect);

  if (!webview.empty && webview.attached) {
    var viewRect = document.createElement('div');
    viewRect.className = 'view-rect';
    if (!webview.visible)
      viewRect.classList.add('hidden');
    function percent(ratio) {
      return ratio * 100 + '%';
    }
    viewRect.style.left = percent(webview.screenX / screenWidth);
    viewRect.style.top = percent(webview.screenY / screenHeight);
    viewRect.style.width = percent(webview.width / screenWidth);
    viewRect.style.height = percent(webview.height / screenHeight);
    screenRect.appendChild(viewRect);
  }

  row.insertBefore(thumbnail, row.firstChild);
}

function addTargetToList(data, list, properties) {
  var row = document.createElement('div');
  row.className = 'row';

  var subrowBox = document.createElement('div');
  subrowBox.className = 'subrow-box';
  row.appendChild(subrowBox);

  var subrow = document.createElement('div');
  subrow.className = 'subrow main';
  subrowBox.appendChild(subrow);

  var description = null;
  for (var j = 0; j < properties.length; j++)
    subrow.appendChild(formatValue(data, properties[j]));

  if (description)
    addWebViewDescription(description, subrowBox);

  var actionBox = document.createElement('div');
  actionBox.className = 'actions';
  subrowBox.appendChild(actionBox);

  addActionLink(row, 'inspect', inspect.bind(null, data),
      data.hasNoUniqueId || data.adbAttachedForeign);

  list.appendChild(row);
  return row;
}

function addActionLink(row, text, handler, opt_disabled) {
  var link = document.createElement('a');
  if (opt_disabled)
    link.classList.add('disabled');
  else
    link.classList.remove('disabled');

  link.setAttribute('href', '#');
  link.textContent = text;
  link.addEventListener('click', handler, true);
  row.querySelector('.actions').appendChild(link);
}


function initSettings() {
  $('discover-usb-devices-enable').addEventListener('change',
                                                    enableDiscoverUsbDevices);

  $('port-forwarding-enable').addEventListener('change', enablePortForwarding);
  $('port-forwarding-config-open').addEventListener(
      'click', openPortForwardingConfig);
  $('port-forwarding-config-close').addEventListener(
      'click', closePortForwardingConfig);
  $('port-forwarding-config-done').addEventListener(
      'click', commitPortForwardingConfig.bind(true));
}

function enableDiscoverUsbDevices(event) {
  chrome.send('set-discover-usb-devices-enabled', [event.target.checked]);
}

function enablePortForwarding(event) {
  chrome.send('set-port-forwarding-enabled', [event.target.checked]);
}

function handleKey(event) {
  switch (event.keyCode) {
    case 13:  // Enter
      if (event.target.nodeName == 'INPUT') {
        var line = event.target.parentNode;
        if (!line.classList.contains('fresh') ||
            line.classList.contains('empty')) {
          commitPortForwardingConfig(true);
        } else {
          commitFreshLineIfValid(true /* select new line */);
          commitPortForwardingConfig(false);
        }
      } else {
        commitPortForwardingConfig(true);
      }
      break;

    case 27:
      commitPortForwardingConfig(true);
      break;
  }
}

function setModal(dialog) {
  dialog.deactivatedNodes = Array.prototype.filter.call(
      document.querySelectorAll('*'),
      function(n) {
        return n != dialog && !dialog.contains(n) && n.tabIndex >= 0;
      });

  dialog.tabIndexes = dialog.deactivatedNodes.map(
    function(n) { return n.getAttribute('tabindex'); });

  dialog.deactivatedNodes.forEach(function(n) { n.tabIndex = -1; });
  window.modal = dialog;
}

function unsetModal(dialog) {
  for (var i = 0; i < dialog.deactivatedNodes.length; i++) {
    var node = dialog.deactivatedNodes[i];
    if (dialog.tabIndexes[i] === null)
      node.removeAttribute('tabindex');
    else
      node.setAttribute('tabindex', tabIndexes[i]);
  }

  if (window.holdDevices) {
    populateRemoteTargets(window.holdDevices);
    delete window.holdDevices;
  }

  delete dialog.deactivatedNodes;
  delete dialog.tabIndexes;
  delete window.modal;
}

function openPortForwardingConfig() {
  loadPortForwardingConfig(window.portForwardingConfig);

  $('port-forwarding-overlay').classList.add('open');
  document.addEventListener('keyup', handleKey);

  var freshPort = document.querySelector('.fresh .port');
  if (freshPort)
    freshPort.focus();
  else
    $('port-forwarding-config-done').focus();

  setModal($('port-forwarding-overlay'));
}

function closePortForwardingConfig() {
  $('port-forwarding-overlay').classList.remove('open');
  document.removeEventListener('keyup', handleKey);
  unsetModal($('port-forwarding-overlay'));
}

function loadPortForwardingConfig(config) {
  var list = $('port-forwarding-config-list');
  list.textContent = '';
  for (var port in config)
    list.appendChild(createConfigLine(port, config[port]));
  list.appendChild(createEmptyConfigLine());
}

function commitPortForwardingConfig(closeConfig) {
  if (closeConfig)
    closePortForwardingConfig();

  commitFreshLineIfValid();
  var lines = document.querySelectorAll('.port-forwarding-pair');
  var config = {};
  for (var i = 0; i != lines.length; i++) {
    var line = lines[i];
    var portInput = line.querySelector('.port');
    var locationInput = line.querySelector('.location');

    var port = portInput.classList.contains('invalid') ?
               portInput.lastValidValue :
               portInput.value;

    var location = locationInput.classList.contains('invalid') ?
                   locationInput.lastValidValue :
                   locationInput.value;

    if (port && location)
      config[port] = location;
  }
  chrome.send('set-port-forwarding-config', [config]);
}

function updateDiscoverUsbDevicesEnabled(enabled) {
  var checkbox = $('discover-usb-devices-enable');
  checkbox.checked = !!enabled;
  checkbox.disabled = false;
}

function updatePortForwardingEnabled(enabled) {
  var checkbox = $('port-forwarding-enable');
  checkbox.checked = !!enabled;
  checkbox.disabled = false;
}

function updatePortForwardingConfig(config) {
  window.portForwardingConfig = config;
  $('port-forwarding-config-open').disabled = !config;
}

function createConfigLine(port, location) {
  var line = document.createElement('div');
  line.className = 'port-forwarding-pair';

  var portInput = createConfigField(port, 'port', 'Port', validatePort);
  line.appendChild(portInput);

  var locationInput = createConfigField(
      location, 'location', 'IP address and port', validateLocation);
  line.appendChild(locationInput);
  locationInput.addEventListener('keydown', function(e) {
    if (e.keyIdentifier == 'U+0009' &&  // Tab
        !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey &&
        line.classList.contains('fresh') &&
        !line.classList.contains('empty')) {
      // Tabbing forward on the fresh line, try create a new empty one.
      commitFreshLineIfValid(true);
      e.preventDefault();
    }
  });

  var lineDelete = document.createElement('div');
  lineDelete.className = 'close-button';
  lineDelete.addEventListener('click', function() {
    var newSelection = line.nextElementSibling;
    line.parentNode.removeChild(line);
    selectLine(newSelection);
  });
  line.appendChild(lineDelete);

  line.addEventListener('click', selectLine.bind(null, line));
  line.addEventListener('focus', selectLine.bind(null, line));

  checkEmptyLine(line);

  return line;
}

function validatePort(input) {
  var match = input.value.match(/^(\d+)$/);
  if (!match)
    return false;
  var port = parseInt(match[1]);
  if (port < 5000 || 10000 < port)
    return false;

  var inputs = document.querySelectorAll('input.port:not(.invalid)');
  for (var i = 0; i != inputs.length; ++i) {
    if (inputs[i] == input)
      break;
    if (parseInt(inputs[i].value) == port)
      return false;
  }
  return true;
}

function validateLocation(input) {
  var match = input.value.match(/^([a-zA-Z0-9\.]+):(\d+)$/);
  if (!match)
    return false;
  var port = parseInt(match[2]);
  return port <= 10000;
}

function createEmptyConfigLine() {
  var line = createConfigLine('', '');
  line.classList.add('fresh');
  return line;
}

function createConfigField(value, className, hint, validate) {
  var input = document.createElement('input');
  input.className = className;
  input.type = 'text';
  input.placeholder = hint;
  input.value = value;
  input.lastValidValue = value;

  function checkInput() {
    if (validate(input))
      input.classList.remove('invalid');
    else
      input.classList.add('invalid');
    if (input.parentNode)
      checkEmptyLine(input.parentNode);
  }
  checkInput();

  input.addEventListener('keyup', checkInput);
  input.addEventListener('focus', function() {
    selectLine(input.parentNode);
  });

  input.addEventListener('blur', function() {
    if (validate(input))
      input.lastValidValue = input.value;
  });

  return input;
}

function checkEmptyLine(line) {
  var inputs = line.querySelectorAll('input');
  var empty = true;
  for (var i = 0; i != inputs.length; i++) {
    if (inputs[i].value != '')
      empty = false;
  }
  if (empty)
    line.classList.add('empty');
  else
    line.classList.remove('empty');
}

function selectLine(line) {
  if (line.classList.contains('selected'))
    return;
  unselectLine();
  line.classList.add('selected');
}

function unselectLine() {
  var line = document.querySelector('.port-forwarding-pair.selected');
  if (!line)
    return;
  line.classList.remove('selected');
  commitFreshLineIfValid();
}

function commitFreshLineIfValid(opt_selectNew) {
  var line = document.querySelector('.port-forwarding-pair.fresh');
  if (line.querySelector('.invalid'))
    return;
  line.classList.remove('fresh');
  var freshLine = createEmptyConfigLine();
  line.parentNode.appendChild(freshLine);
  if (opt_selectNew)
    freshLine.querySelector('.port').focus();
}

document.addEventListener('DOMContentLoaded', onload);
