class TabsContainer {

  private lastXMLHttpRequest: XMLHttpRequest = null;

  navigation: any = {};

  contents: any = {};

  public setActive(link) {
    const targetTab = link.getAttribute('data-tab');
    const url = link.getAttribute('data-page');

    if (this.lastXMLHttpRequest !== null) {
      this.lastXMLHttpRequest.abort();
    }

    for (let tab in this.navigation) {
      if (tab === targetTab) {
        this.navigation[tab].classList.add('active');
      } else {
        this.navigation[tab].classList.remove('active');
      }
    }

    let targetContent = null;

    for (let tab in this.contents) {
      if (tab === targetTab) {
        this.contents[tab].classList.add('visible');
        targetContent = this.contents[tab];
      } else {
        this.contents[tab].classList.remove('visible');
      }
    }

    this.setLoadingPlaceholder(targetContent);

    this.lastXMLHttpRequest = new XMLHttpRequest();
    this.lastXMLHttpRequest.open('GET', url, true);
    this.lastXMLHttpRequest.addEventListener('readystatechange', () => {
      if (this.lastXMLHttpRequest.readyState === 4 && this.lastXMLHttpRequest.status === 200) {
        targetContent.innerHTML = this.lastXMLHttpRequest.responseText;

        this.useAjax(targetContent);
      }
    });
    this.lastXMLHttpRequest.send();
  }

  private setLoadingPlaceholder(element: HTMLElement) {
    element.innerHTML = '<h1>Загрузка...</h1>';
  }

  private useAjax(root: HTMLElement) {
    const links = root.querySelectorAll('a');
    const forms = root.querySelectorAll('form');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', (e) => {
        e.preventDefault();
        const url = links[i].getAttribute('href');
        if (url.indexOf('javascript:') === 0) {
          return;
        }

        if (this.lastXMLHttpRequest !== null) {
          this.lastXMLHttpRequest.abort();
        }

        this.setLoadingPlaceholder(root);

        this.lastXMLHttpRequest = new XMLHttpRequest();
        this.lastXMLHttpRequest.open('GET', url, true);

        this.lastXMLHttpRequest.addEventListener('readystatechange', () => {
          if (this.lastXMLHttpRequest.readyState === 4 && this.lastXMLHttpRequest.status === 200) {
            root.innerHTML = this.lastXMLHttpRequest.responseText;
            this.useAjax(root);
          }
        });

        this.lastXMLHttpRequest.send();
      });
    }

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const url = form.getAttribute('action');
        const method = form.hasAttribute('method') ? form.getAttribute('method') : 'post';
        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            root.innerHTML = xhr.responseText;
            this.useAjax(root);
          }
        });
        xhr.send(formData);
      });
    }
  }

}

export function tabs() {
  const tabsContainers = document.querySelectorAll('[data-tabs-container]');
  for (let i = 0; i < tabsContainers.length; i++) {
    const tabsContainer = tabsContainers[i];
    const navigation = tabsContainer.querySelectorAll('a[data-tab]');
    const contents = tabsContainer.querySelectorAll('.tab-content');
    const container = new TabsContainer();
    for (let j = 0; j < navigation.length; j++) {
      const navigationLink = navigation[j];
      container.navigation[navigationLink.getAttribute('data-tab')] = (navigationLink as HTMLAnchorElement);
      navigationLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.setActive(navigationLink);
      });
    }
    for (let j = 0; j < contents.length; j++) {
      const content = contents[j];
      container.contents[content.getAttribute('data-tab')] = content;
    }
  }
}