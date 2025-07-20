# Ionic Academy

## Contents
[Torah Notes](#torah-notes)

1. [Ionic Tabs with Menus](#ionic-tabs-with-menus)
2. [Image Cropping and Transformation with Ionic Angular](#image-cropping-and-transformation-with-ionic-angular)
3. [Adding a Rich Text Editor to your Ionic App [v6]](#adding-a-rich-text-editor-to-your-ionic-app-v6)
4. [Adding Text to Speech and Speech Recognition to your Capacitor App [v6]](#adding-text-to-speech-and-speech-recognition-to-your-capacitor-app-v6)
5. [Ionic Audio Recording like WhatsApp with Capacitor](#ionic-audio-recording-like-whatsapp-with-capacitor)
6. [Adding AdMob to Your Ionic App with Capacitor [v6]](#adding-admob-to-your-ionic-app-with-capacitor-v6)
7. [How to send Emails with Ionic using Capacitor [v6]](#how-to-send-emails-with-ionic-using-capacitor-v6)
8. [How to Share Data Between Pages in Ionic Apps using Angular (Part 2/2) [v6]](#how-to-share-data-between-pages-in-ionic-apps-using-angular-part-22-v6)
9. [How to Pass Data Between Pages in Ionic Apps using Angular (Part 1/2) [v6]](#how-to-pass-data-between-pages-in-ionic-apps-using-angular-part-12-v6)
10. [How to Setup Deep Links With Capacitor (iOS & Android) [v6]](#how-to-setup-deep-links-with-capacitor-ios--android-v6)
11. [How to use Angular Virtual Scroll with Ionic [v6]](#how-to-use-angular-virtual-scroll-with-ionic-v6)
12. [How to Customise Ionic 6 Modal and Popover [v6]](#how-to-customise-ionic-6-modal-and-popover-v6)
13. [How to Cache Image Files with Ionic & Capacitor [v5]](#how-to-cache-image-files-with-ionic--capacitor-v5)
14. [How to Lazy Load Images with Ionic [v5]](#how-to-lazy-load-images-with-ionic-v5)
15. [Sign in with Apple from Angular Apps using Capacitor and Firebase](#sign-in-with-apple-from-angular-apps-using-capacitor-and-firebase)
16. [How to Write Unit Tests for your Ionic Angular App](#how-to-write-unit-tests-for-your-ionic-angular-app)
17. [How to send Emails with Ionic using Capacitor [v6]](#how-to-send-emails-with-ionic-using-capacitor-v6-1)
18. [How to add Google Sign In using Capacitor to your Ionic App [v6]](#how-to-add-google-sign-in-using-capacitor-to-your-ionic-app-v6)
19. [Building an Ionic App with Firebase Authentication & File Upload using AngularFire 7](#building-an-ionic-app-with-firebase-authentication--file-upload-using-angularfire-7)
20. [How to Create an Ionic Side Menu with Accordion Items [v6]](#how-to-create-an-ionic-side-menu-with-accordion-items-v6)
21. [How to use the Ionic 6 Accordion Component [v6]](#how-to-use-the-ionic-6-accordion-component-v6)
22. [How to use the Ionic 6 Datetime component [v6]](#how-to-use-the-ionic-6-datetime-component-v6)
23. [Ionic Image Zoom with Swiper [v6]](#ionic-image-zoom-with-swiper-v6)
24. [Build Your First Ionic App with Firebase using AngularFire 7](#build-your-first-ionic-app-with-firebase-using-angularfire-7)
25. [How to use Ionic Storage v3 with Angular [v6]](#how-to-use-ionic-storage-v3-with-angular-v6)
26. [How to Handle User Roles in Ionic Apps with Guard & Directives](#how-to-handle-user-roles-in-ionic-apps-with-guard--directives)
27. [How to Force Update Ionic Apps [v5]](#how-to-force-update-ionic-apps-v5)
28. [Hosting an Ionic PWA with API Caching on Netlify](#hosting-an-ionic-pwa-with-api-caching-on-netlify)
29. [How to Build Your Own Ionic Library for NPM](#how-to-build-your-own-ionic-library-for-npm)

[anchor](#anchor)

# Ionic Tabs with Menus

## Setting up the Tab Bar App
We start this tutorial with some generated code for the tab bar, since the template works just fine and requires a bit less typing. We also need more pages that we can navigate to from our menu, so go ahead and run:

`ionic start academyMenus tabs --type=angular`

Change directories into the new project:
`cd ./academyMenus`

```bash
ionic g page home
ionic g page news
ionic g page user
ionic g page account
```

The first step towards our multi menu app is to change our overall routing, but it just requires a small change: We need to redirect directly to one specific page in order to automatically open the first page of a menu.

Actually I’m not yet 100% sure why it’s not working with another redirect, but for now just apply a small change to your tabs/tabs-routing.module.ts:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
```

We basically changed the redirect from /tabs/tab1 to /tabs/tab1/home, and we will implement this home path in the next step within the first menu.

## Building the First Side Menu
Both menus (or any other menu that you want to add) contains almost the same code, with only slight changes in terms of IDs and paths.

First of all we need to prepare the routing of the first tab to contain some children route – just like you do when you normally build a side menu. For this, go ahead and change the tab1/tab1.module.ts to:

```typescript
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'news',
        loadChildren: () =>
          import('../news/news.module').then(m => m.NewsPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}

```


So we’ve now included two of our pages in this routing, and now we can create the markup for the side menu.

In general we use the standard layout of a side menu, but we need to make sure we specify a menuId since this will be used to distinguish different menus in the app.

Also, we need to make sure that the contentId of the pane, menu and the router outlet have the same value in order to make everything work together.

Besides that we add two routes to the pages we defined in our routing in the previous step.

Go ahead and change the tab1/tab1.page.html to:

```html
<ion-split-pane contentId="content" [disabled]="!paneEnabled">
  <ion-menu contentId="content" menuId="first">

    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu 1</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-menu-toggle auto-hide="false" menu="first">
          <ion-item routerLink="/tabs/tab1/home" routerDirection="root" routerLinkActive="active-item">
            <ion-label>
              Home
            </ion-label>
          </ion-item>
          <ion-item routerLink="/tabs/tab1/news" routerDirection="root" routerLinkActive="active-item">
            <ion-label>
              News
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>

  </ion-menu>

  <ion-router-outlet id="content"></ion-router-outlet>
</ion-split-pane>

```

But this is not yet enough! As you might have noticed, we also have a disabled value on our ion-split-pane. This is a fix to only enable one split pane in our app, since multiple active will lead to strange results in the end (just give it a try without it).

So now we need to check whenever we enter or leave the page, and enable/disable the pane of the page.

On top of that we also need to enable the menu of the page by its ID whenever we enter the page.

The result looks like this inside your tab1/tab1.page.ts:

```typescript
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  paneEnabled = true;

  constructor(private menuController: MenuController) { }

  ionViewWillEnter() {
    this.paneEnabled = true;
    this.menuController.enable(true, 'first');
  }

  ionViewWillLeave() {
    this.paneEnabled = false;
  }
}
```

We now have a tab bar application, and on the first tab we have a side menu!

## Building the Second Side Menu
The second menu we add follows the completely same approach:

Add the pages for the routing
Add the menu markup code
Enable/disable the menu properties
To do so, open the tab2/tab2.module.ts and add our other two pages:

```typescript
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('../user/user.module').then(m => m.UserPageModule)
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
  
  ```
  
Next stop is the markup, and in here we need to make sure we are using different IDs for the menu and content area. Of course the menu items also have a different path, the one we defined in the routing before, so go ahead with the tab2/tab2.page.html:

```html
<ion-split-pane contentId="second-content" [disabled]="!paneEnabled">
  <ion-menu contentId="second-content" menuId="second">

    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-menu-toggle auto-hide="false" menu="second">
          <ion-item routerLink="/tabs/tab2/user" routerDirection="root" routerLinkActive="active-item">
            <ion-label>
              User
            </ion-label>
          </ion-item>
          <ion-item routerLink="/tabs/tab2/account" routerDirection="root" routerLinkActive="active-item">
            <ion-label>
              Account
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
    
  </ion-menu>

  <ion-router-outlet id="second-content"></ion-router-outlet>
</ion-split-pane>
```


And finally again the third step, making sure to enabled/disabled the second created menu by its ID inside thetab2/tab2.page.ts:

```typescript
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  paneEnabled = true;

  constructor(private menuController: MenuController) { }

  ionViewWillEnter() {
    this.paneEnabled = true;
    this.menuController.enable(true, 'second');
  }

  ionViewWillLeave() {
    this.paneEnabled = false;
  }
}
```


Now you have two separate menus on two different tabs, but there are a few small things left to add.

## Adding Menu Buttons & Styling
If you inspect the app with a small preview you can’t really open the menu, so in oder to fix this we need to add menu buttons to our four pages.

Because we have different menus with different IDs, we need to make sure to add the menu to the button, so for the home/home.page.html and the news/news.page.html add:
```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button menu="first"></ion-menu-button>
    </ion-buttons>
    <ion-title>Home</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

</ion-content>
```

To target the second menu, we need to change the user/user.page.ts and account/account.page.ts to:

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button menu="second"></ion-menu-button>
    </ion-buttons>
    <ion-title>user</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

</ion-content>
```


Now we have a menu button on all pages, so it works on both bigger screens where the menu is visible through the Ionic split pane logic, and also on regular phone device screens.

Finally, we can add a small CSS rule to mark the active menu item like this inside our global.scss:

```css
.active-item {
  border-left: 8px solid var(--ion-color-primary);
}
```


## Conclusion
It is possible to have multiple side menus inside an Ionic app – but it’s a bit tricky. If you run the app you will also notice that the navigation history of a tab is not really maintained, so you would need a bit of additional code to maintain the last active menu item yourself and route to it whenever you change back to a certain tab.

You can also watch a video version of this Quick Win below.


# Building an Ionic React Side Menu Navigation [v6]
Posted on September 13th, 2022

ionic-react-side-menu

Building an Ionic React Side Menu navigation is a very convenient way to add navigation to your Ionic app and hide elements behind a menu that users can pull in.

If you want a side menu navigation for your Ionic React app, Ionic makes it super easy to define routes and outlets to separate the menu from the rest of your app.

ionic-react-side-menu
The side menu is the second most popular app navigation scheme after the Ionic React tab bar which is even easier to implement.

We will also have a dummy login page before the actual side menu so you can customise this Ionic React template exactly to your app needs later.

## Starting the Ionic React Menu App
To truly understand these navigation concepts we begin with a blank new Ionic React application and add a few additional files using the command line:
```bash
ionic start myMenu blank --type=react
cd ./myTabs

# Add pages for our tabs example
touch src/pages/Login.tsx
touch src/pages/Menu.tsx
touch src/pages/Page1.tsx
touch src/pages/Page2.tsx
```

Now the IDE will most likely complain because we are using Typescript by default and those files are empty.

To fix this quickly, simply put a code like the following into those pages but make sure you change the component name and export line at the end. It’s also helpful if you are giving them a different title string so you can clearly see on which page you are later.

An example for the src/pages/Page1.tsx looks like this:
```typescript
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react'

const Page1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  )
}

export default Page1
```


At this point the compile error should be gone, and we can focus on building the actual React side menu navigation.

## Creating the Menu Navigation
In many cases you have some kind of introduction or login screen before the actual side menu, and that’s what we gonna do as well.

If that’s not the case for you, you could simply leave out the route we set up as the entry point and directly open the menu – but the actual structure of our app could stay the same.

So for the initial route we will load our Login component, and for everything that’s under the /app path we will use the Menu component. This means, the menu component will define both the UI for the side menu and also hold more routing information for the React router DOM that’s used under the hood!

The IonReactRouter is just a wrapper around the React router, and the IonRouterOutlet is a container to make sure there’s a nice animation between the transition of different pages.

Now go ahead with the src/App.tsx and change it to:
```typescript
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import Login from './pages/Login'
import Menu from './pages/Menu'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Login} />
        <Route path="/app" component={Menu} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
```


Usually you would setup your login including auth logic, but we just gonna keep it to one button which calls a function.

Inside the doLogin() we can use the Ionic router to navigate directly to another page of our app by setting it as the new root. You could also use forward which would result in a push animation instead!

Open up the src/pages/Login.tsx and change it to this now:
```typescript
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  useIonRouter,
} from '@ionic/react'

const Login: React.FC = () => {
  const navigation = useIonRouter()

  const doLogin = () => {
    // Make your auth stuff
    navigation.push('/app', 'root', 'replace')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My cool app</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => doLogin()} expand="full">
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Login
```
                     
At this point our app opens on the login and we can route to the menu – we now need the actual menu implementation!

The Ionic menu comes with another special wrapper that we will also use around the actual menu called split pane.

By using the split pane, a menu will be shown directly on one side when viewing our app/website eon a bigger screen, and a hidden side menu is used on smaller screens like a phone. We get this automatically by using the IonSplitPane, we just need to make sure we give the same contentId to both the IonMenu and IonRouterOutlet inside of our split pane.

The menu simply defines the view on the side where you usually have some buttons or routes, and inside the router outlet we define the different paths of our app.

The menu in our case consists of items which are also wrapped inside the IonMenuToggle, which simply helps to automatically close the menu when an entry is selected!

By setting autoHide to false we make sure that those items are also displayed on bigger screens where the menu is open all the time.

For the routing we just use the different components we created in the beginning, so now go ahead and change the src/pages/Menu.tsx to:
```typescript
import {
  IonHeader,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonMenuToggle,
  IonPage,
} from '@ionic/react'
import { Route, Redirect } from 'react-router'
import Page1 from './Page1'
import Page2 from './Page2'
import { homeOutline, newspaperOutline, logOutOutline } from 'ionicons/icons'
import Details from './Details'

const Menu: React.FC = () => {
  const paths = [
    { name: 'Home', url: '/app/page1', icon: homeOutline },
    { name: 'News', url: '/app/page2', icon: newspaperOutline },
  ]

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            {paths.map((item, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={item.url} routerDirection="none">
                  <IonIcon icon={item.icon} slot="start" />
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}
            <IonButton routerLink="/" routerDirection="back" expand="full">
              <IonIcon icon={logOutOutline} slot="start"></IonIcon>
              Logout
            </IonButton>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id="main">
          <Route exact path="/app/page1" component={Page1} />
          <Route path="/app/page2" component={Page2} />
          <Route exact path="/app">
            <Redirect to="/app/page1" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  )
}

export default Menu
```

The login only routes the user to the /app route, so we have an additional exact match for that path set up which redirects us directly to /app/page1, so this will always be the first inside page the user sees after a login!

Careful: In most examples you won’t see the IonPage around the side menu setup, which results in now animations shown when going to the menu from a previous page. By wrapping all of this in a page we get the benefit of having the menu in one file and also the default animations from Ionic!

At this point your inside area side menu should already work, but I recommend you also add an IonMenuButton to both of your pages so you can always toggle the menu.

But at this point you could already drag from the side of your screen and the menu would appear as well – but usually you want both options for a user.

Therefore open the src/pages/Page1.tsx and change it to this:
```typescript
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
} from '@ionic/react'

const Page1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Page1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton routerLink="/app/page1/details" expand="full">
          Go deeper!
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Page1
```

You can also do the same for the second page if you want to.

## Navigating to Child Pages
To have more power inside your app you might want to open a details page, and we already added a button to our first opened page so all we need now is a bit of routing and an additional page.

Let’s begin by creating a new page:

`touch src/pages/Details.tsx`

On that page we will add an IonBackButton that will be automatically displayed when we set up the path to this page and make it use the same beginning path components like its parent page.

Before we setup the routing, let’s change the new src/pages/Details.tsx to this:
```typescript
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from '@ionic/react'

const Details: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/page1" />
          </IonButtons>
          <IonTitle>My Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  )
}

export default Details
```

We can now include the additional Route information inside of our src/pages/Menu.tsx:
```typescript
<IonRouterOutlet id="main">
  <Route exact path="/app/page1" component={Page1} />
  <Route exact path="/app/page1/details" component={Details} />
  <Route path="/app/page2" component={Page2} />
  <Route exact path="/app">
    <Redirect to="/app/page1" />
  </Route>
</IonRouterOutlet>
```

Now run the app on a browser and see how it behaves on bigger and smaller screens – isn’t that awesome?

## Conclusion
Setting up an Ionic React side menu isn’t hard, but the UI you get with this pattern is very powerful and suits many app cases.

By having the whole menu in one file you could now integrate this easily in your own Ionic React app wherever you need it without messing app the whole routing of your app.

You can also find a video version of this Quick Win below.

[top](#ionic-academy)
# Adding a Rich Text Editor to your Ionic App [v6]
Posted on April 12th, 2022

rich-text-editor-ionic

If you want to capture more than plain data from your users, you can easily integrate a rich text editor with all functionalities already included in your Ionic app.

In this Quick Win we will integrate QuillJS, a powerful rich text editor that allows us to use all kind of formatting and functionalities that a standard input field would never give us!


On top of that we add a display option so we can actually show a preview and use the result from our editor on a new page.


## Creating the Ionic Editor App
To get started create a new Ionic app and install both the Quill package as well as the Angular wrapper ngx-quill:
```bash
ionic start academyEditor blank --type=angular
cd ./academyEditor

ionic g page display

npm i ngx-quill quill
npm i --save-dev @types/quill@1.3.10
```

The types will also come in handy later when we use the Quill API, and the additional page will be used to display a preview.

The editor comes with a pretty cool styling out of the box, but to use it we need to include it inside our src/global.scss:
```scss
@import "~quill/dist/quill.snow.css";
```
That’s all you need for the basic setup!

## Adding a Standard Quill Editor
To use the editor you need to import the module inside the module of your lazy loaded page, so in our example let’s do it inside the src/app/home/home.module.ts:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { QuillModule } from 'ngx-quill';
import { DisplayPageModule } from '../display/display.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    QuillModule,
    DisplayPageModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
```

Note: I also added the DisplayPageModule because we will use the page as a modal and Angular might complain otherwise.

Now all we need to add the default version of the Quill editor is one line inside our src/app/home/home.page.html:
```html
<ion-header>
  <ion-toolbar color="success">
    <ion-title> Academy Editor </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <quill-editor></quill-editor>
</ion-content>
```

Run the preview of your app and you got the text editor with all default functionality – which is pretty impressive!

## Customising the Editor and Content Preview
Now most likely you want to tweak the editor to your needs, and that’s what we are doing next.

First, we might want to change the toolbar of the editor, which we can do by passing a custom definition to the module.

Caution: Adding the custom configuration doesn’t work inside the lazy loaded module file, only at the top level of your application!

Therefore, let’s open the src/app/app.module.ts and change it to:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { QuillModule, QuillModules } from 'ngx-quill';

const modules: QuillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],

    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ['link', 'image', 'video'],
  ],
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QuillModule.forRoot({
      placeholder: 'Start writing',
      modules,
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

We now got a more customised version of the toolbar including a different placeholder. You can also check out the typings and see the rest of the possible configuration elements, or just browse the Quill configuration documentation!

Now we want to connect the output of our editor to a variable, so we can actually use the result. For this, let’s change our src/app/home/home.page.html and include some additional buttons as well:
```html
<ion-header>
  <ion-toolbar color="success">
    <ion-title> Academy Editor </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="clearEditor()">
        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
      </ion-button>
      <ion-button (click)="preview()">
        <ion-icon slot="icon-only" name="save-outline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <quill-editor [(ngModel)]="mytext" theme="snow"></quill-editor>
</ion-content>
```

With that in place we can add some real functionality and directly access our viewchild of the QuillEditorComponent, which exposes everything we need!

You can find all methods of Quill inside the API docs, in our case we simply use the setText() method and also subscribe to the onContentChanged() Observable which fire whenever we change the data within the editor.

This could be a good place to check for profanity, or you could even listen for specific keyboard inputs!

Additionally we create our modal at this point and simply pass our data to it, so let’s open the src/app/home/home.page.ts and change it to:
```typescript
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { DisplayPage } from '../display/display.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
  mytext = null;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  clearEditor() {
    this.editor.quillEditor.setText('');
  }

  async preview() {
    console.log(this.mytext);
    const modal = await this.modalCtrl.create({
      component: DisplayPage,
      componentProps: { data: this.mytext },
    });

    await modal.present();
  }

  ngAfterViewInit(): void {
    this.editor.onContentChanged.subscribe(async (change: ContentChange) => {
      console.log('Editor changed: ', change);

      const changed = change.content.ops.pop();
      if (changed.insert.indexOf('ionic') >= 0) {
        const toast = await this.toastCtrl.create({
          message: 'You called me?',
          duration: 2000,
        });
        toast.present();
      }
    });
  }
}
```

Now we can move on to our src/app/display/display.module.ts and also import the Quill module here:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayPageRoutingModule } from './display-routing.module';

import { DisplayPage } from './display.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayPageRoutingModule,
    QuillModule,
  ],
  declarations: [DisplayPage],
})
export class DisplayPageModule {}
```

Why are we adding this in here as well?

For this, let’s quickly talk about the Quill data format:

By default, the output will be an HTML string. This string could be easily displayed using [innerHtml], but with Angular that’s an insecure way of displaying HTML.

On top of that, there are different data formats like Delta which are actually better suited if you want to store the data inside your database later, and those formats won’t work with a standard HTML tag as it’s more a JSON representation of your data.

You can see more about the different formats in the video below the Quick Win were I also used the other formats by changing the format property in the initial configuration.

To first of all access the data inside the modal, let’s change the src/app/display/display.page.ts to:
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-display',
  templateUrl: './display.page.html',
  styleUrls: ['./display.page.scss'],
})
export class DisplayPage {
  @Input() data: string;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
```

Whatever data format you prefer, our demo app uses plain HTML but we can still display this better by using the quill-view-html element!

For this, let’s add it to our template and connect it to the data by changing the src/app/display/display.page.html to:
```html
<ion-header>
  <ion-toolbar color="secondary">
    <ion-title>Preview</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="dismiss()">
        <ion-icon slot="icon-only" name="close-outline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <!-- <div [innerHtml]="data"></div> -->
  <quill-view-html [content]="data"></quill-view-html>
</ion-content>
```

Now you can insert anything you want into the editor and even change the format, displaying the data with the quill view works with any format!

## Teardown
It’s really too easy to add a powerful rich text editor to your Ionic app! You can customise all settings like the toolbar module or different other properties of the editor, use its API or listen to the different changes.

For storing the data definitely check out the different available formats and select the one that makes the most sense for your application!

You can also find a video version of this Quick Win below.

# Adding Text to Speech and Speech Recognition to your Capacitor App [v6]
Posted on May 24th, 2022

If you want automatically generated speech from text or transform your users voice into text you can easily implement thse functions with Capacitor today.

In this Quick Win we will implement both text to speech and also speech recognition so you could almost build a bot that talks to itself.

To achieve this we will use the according plugins from the Capacitor community and just a bit of special code for our native platforms.

Keep in mind that although these are Capacitor plugins, they don’t have a web implementation so you need to use them from within a native iOS or Android app!


## Setting up the Ionic App with Capacitor
To get started generate a new Ionic app and install the respective plugins before generating the native app platforms in your project:
```bash
ionic start academySpeech blank --type=angular
cd ./academySpeech

npm install @capacitor-community/text-to-speech
npm install @capacitor-community/speech-recognition

ionic build
ionic cap add ios
ionic cap add android
```

Now we need a bit of customization for our native platforms as we need to ask for certain permissions. First we can open the ios/App/App/Info.plist of our iOS project and insert two additional keys:
```xml
	<key>NSSpeechRecognitionUsageDescription</key>
	<string>To translate voice into words</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>To record your voice</string>
```
Make sure you are using reasonable information for both keys here that describe why you need access to this feature.

For Android, we need to add the speech recognition service and also add one additional permission to the android/app/src/main/AndroidManifest.xml:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="io.ionic.starter">

    <queries>
      <intent>
        <action android:name="android.intent.action.TTS_SERVICE" />
      </intent>
            <intent>
        <action android:name="android.speech.RecognitionService" />
      </intent>
    </queries>


    <uses-permission android:name="android.permission.RECORD_AUDIO" />
```

That’s all in terms of native project setup, so let’s use the functions now!

Building Text to Speech and Speech Recognition
Both features are pretty easy to use, so we will do both at the same time in one file.

To speak some text, we will use our local myText variable and simply call the speak() function of our plugin.

You can pass a bunch of text to speech options here to affect the voice, but we will keep it to the bare minimum, just some text!

For our speech recognition we will first of all call requestPermission() which is required on Android, on iOS it would automatically ask for the permission when you are using it for the first time.

When we start the recognition with start() we will also toggle our local recording flag to show a different UI, which we will revert inside the stopRecognition() again.

Now let’s go ahead and change the src/app/home/home.page.ts to:
```typescript
import { ChangeDetectorRef, Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myText = 'Today is a good day to learn Ionic';
  recording = false;
  voices = [];

  constructor(private changeDetector: ChangeDetectorRef) {
    SpeechRecognition.requestPermission();
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();

    if (available) {
      SpeechRecognition.start({
        language: 'en-US',
        partialResults: true,
        popup: false
      });

      this.recording = true;

      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
          this.myText = data.matches[0];
          this.changeDetector.detectChanges();
        }

        // Android has different result type
        if (data.value && data.value.length > 0) {
          this.myText = data.value[0];
          this.changeDetector.detectChanges();
        }
      });
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }

  speakText() {
    TextToSpeech.speak({
      text: this.myText,
    });
  }
}
```

The actual logic of catching the speech happens inside the partialResults events listener, where we get the results while people are talking to our app!

*Note: When using the plugin I noticed a difference in the variable names between Android and iOS – that’s why we have two if blocks either using matches or value.*

Most likely this will be fixed in a future release so keep an eye on the result that you get back in there.

Now we just need a simple view in which we can call our functions, and we make sure that we don’t show other options while recording as this usually results in some native exceptions as a recording session is already active and you can’t speak text at the same time.

Therefore bring up the src/app/home/home.page.html and change it to:
```html
<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Academy Speech </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-item>
    <ion-input [(ngModel)]="myText"></ion-input>
  </ion-item>
  <ion-button expand="full" (click)="startRecognition()" *ngIf="!recording">
    <ion-icon name="mic-outline" slot="start"></ion-icon>
    Start speech recognition
  </ion-button>
  <ion-button
    expand="full"
    (click)="stopRecognition()"
    color="danger"
    *ngIf="recording"
  >
    <ion-icon name="mic-off-outline" slot="start"></ion-icon>
    Stop speech recognition
  </ion-button>

  <ion-button expand="full" (click)="speakText()" *ngIf="!recording">
    <ion-icon name="volume-high-outline" slot="start"></ion-icon>
    Speak text
  </ion-button>
</ion-content>
```
Now you can enjoy your simple text to speech and speech recognition app and build out some more advanced functionality based on these great Capacitor community plugins!

Teardown
Functions like text to speech or even speech recognition used to be challenging, but are super easy to add with todays Capacitor plugin ecosystem.

At the time writing I didn’t have to add anything else to Android in contrast to the past where a dedicated recording app had to be installed, and most likely both functionalities will be a web API standard in the near future so we don’t even need a plugin anymore!

You can also find a video version of this Quick Win below.

# Adding AdMob to Your Ionic App with Capacitor [v6]
Posted on May 10th, 2022

If you want to monetise your Ionic app, adding ads with AdMob is a fast and easy way to earn money while keeping your app free for all users!

In this Quick Win we will integrate ads using Google AdMob and the Capacitor community plugin so we are able to display different types of ads in our Ionic app:

Banner: The easiest way if displaying a static banner in your app
Interstitial: A full image or video covering the whole app
Rewarded: The good old “watch this video to get xyz”
All of this can be tested quite fast with dummy ads!

admob-ionic-capacitor
The only thing you need to display ads is some configuration and setup inside Google before presenting them – but we’ll go through the whole setup together.

Google AdMob Setup
Before we get to the Ionic implementation, we should set up our ads inside Google AdMob. If you don’t have an account, go ahead and create one right now.

Now we need to add new apps, which will give us a unique ID for every created app that we later need.

Simply click on Apps in the sidebar and hit ADD APP. Give it some name, and if your app is not yet listed on the App stores simply select “No” when asked – you can add that information later.

Go through this process for both iOS and Android, so you end up with a list of two apps inside the list view:

admbo-overview
This is already enough for testing our apps, since we can display the different ad units based on fake values while testing.

If you later want to go live with your app, you need dedicated ad units for each platform and ad type, which you create inside the Ad units submenu after selecting one of the previously created apps.

From there you can add all the different ad unit types that you want to present in your apps!

ionic-admob-units
This would give you a specific ad unit ID that we need inside our code for a real app, but it’s not required for testing so feel free to skip this for now.

Ionic AdMob Setup with Capacitor
Now we can start a new Ionic app and install the Capacitor AdMob community plugin, followed by a first build and adding the native platforms to our project:

ionic start academyAds blank --type=angular
cd ./academyAds

npm i @capacitor-community/admob

ionic build
ionic cap add ios
ionic cap add android
1
2
3
4
5
6
7
8
ionic start academyAds blank --type=angular
cd ./academyAds
 
npm i @capacitor-community/admob
 
ionic build
ionic cap add ios
ionic cap add android
When your app is ready, we need to configure some values and we can begin by adding the following block to the ios/App/App/Info.plist:

<key>GADIsAdManagerApp</key>
<true/>
<key>GADApplicationIdentifier</key>
<string>YOUR_APP_ID</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
<key>NSUserTrackingUsageDescription</key>
<string>This helps to improve the quality of ads we show.</string>
1
2
3
4
5
6
7
8
9
10
11
12
13
<key>GADIsAdManagerApp</key>
<true/>
<key>GADApplicationIdentifier</key>
<string>YOUR_APP_ID</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
<key>NSUserTrackingUsageDescription</key>
<string>This helps to improve the quality of ads we show.</string>
First of all you need to replace YOUR_APP_ID with the AdMob app id for your iOS app – the one we created in the first step.

You can then also change the tracking description to whatever string you fancy.

We need to add the app id to Android as well, so this time pick the AdMob id for your Android app and insert it as another entry inside the android/app/src/main/res/values/strings.xml:

<string name="admob_app_id">ca-app-...</string>
1
<string name="admob_app_id">ca-app-...</string>
With that value in place we can tell our app to load this string by adding the following block under the application tag inside your android/app/src/main/AndroidManifest.xml:

<meta-data
 android:name="com.google.android.gms.ads.APPLICATION_ID"
 android:value="@string/admob_app_id"/>
1
2
3
<meta-data
 android:name="com.google.android.gms.ads.APPLICATION_ID"
 android:value="@string/admob_app_id"/>
Alright, with this configuration we are ready to display any kind of ad in our Ionic app!

Presenting different Ads
There are different type of ad units available, and we want to take a look at banner, interstitial and reward ads now!

But before you display any kind of ad, you need to initialize AdMob and you can specify some options right here:

requestTrackingAuthorization: Use user tracking for more personalised apps
testingDevices: Specific device IDs for testing – actually you don’t need this when you use testing on your apps later
initializeForTesting: Will serve test production ads to the testingDevices
There are some more settings which you can find inside the AdMobInitializationOptions.

For now, go ahead and change your src/app/home/home.page.ts to this:

import { Component } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    const { status } = await AdMob.trackingAuthorizationStatus();

    if (status === 'notDetermined') {
      console.log('Display information before ads load first time');
    }

    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOURTESTDEVICECODE'],
      initializeForTesting: true,
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
import { Component } from '@angular/core';
import {
  AdMob,
  AdMobRewardItem,
  AdOptions,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { isPlatform } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {
    this.initialize();
  }
 
  async initialize(): Promise<void> {
    const { status } = await AdMob.trackingAuthorizationStatus();
 
    if (status === 'notDetermined') {
      console.log('Display information before ads load first time');
    }
 
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['YOURTESTDEVICECODE'],
      initializeForTesting: true,
    });
  }
}
By checking the status you could also inform the user about the ads before you even make the initialize() call. Otherwise you will immediately see the iOS consent screen for tracking!

Let’s quickly add some buttons to our src/app/home/home.page.html so we can trigger the functions we will create soon:

<ion-header>
  <ion-toolbar>
    <ion-title> Ionic Ads </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button (click)="showBanner()" expand="full">Show Banner</ion-button>
  <ion-button (click)="hideBanner()" expand="full">Hide Banner</ion-button>

  <ion-button (click)="showInterstitial()" expand="full">Show Interstitial</ion-button>
  <ion-button (click)="showRewardVideo()" expand="full">Show Reward Video</ion-button>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
<ion-header>
  <ion-toolbar>
    <ion-title> Ionic Ads </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button (click)="showBanner()" expand="full">Show Banner</ion-button>
  <ion-button (click)="hideBanner()" expand="full">Hide Banner</ion-button>
 
  <ion-button (click)="showInterstitial()" expand="full">Show Interstitial</ion-button>
  <ion-button (click)="showRewardVideo()" expand="full">Show Reward Video</ion-button>
</ion-content>
Alright that wasn’t really challenging, let’s add some ads.

The easiest is probably the banner, which is usually just an image in a fixed position of your page.

To create the banner, you can select a specific BannerAdSize and a BannerAdPosition for your page, including some margin.

At this point you would use your ad unit ID, and you would need a switch between iOS and Android and probably even load the value from your environment file.

For testing, you don’t really need any value for the ID as long as you set isTesting to true.

We can even hide the banner later or completely remove it from our view using the plugin, so go ahead and add the following functions now:

  async showBanner() {
    const adId = isPlatform('ios') ? 'ios-ad-id' : 'android-ad-unit';

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
      // The default behavior of the Google Mobile Ads SDK is to serve personalized ads.
      // Set this to true to request Non-Personalized Ads
      // npa: true
    };
    await AdMob.showBanner(options);
  }

  async hideBanner() {
    // Hides it but still available in background
    await AdMob.hideBanner();

    // Completely removes the banner
    await AdMob.removeBanner();
  }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
  async showBanner() {
    const adId = isPlatform('ios') ? 'ios-ad-id' : 'android-ad-unit';
 
    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
      // The default behavior of the Google Mobile Ads SDK is to serve personalized ads.
      // Set this to true to request Non-Personalized Ads
      // npa: true
    };
    await AdMob.showBanner(options);
  }
 
  async hideBanner() {
    // Hides it but still available in background
    await AdMob.hideBanner();
 
    // Completely removes the banner
    await AdMob.removeBanner();
  }
Notice that you can pass in npa for every add to disable personalized ads for your users!

Now if you run your app on a device, you should see a banner showing at the bottom after clicking the according button.

In most cases, the other ad types are actually more interesting and also more lucrative from a financial perspective.

You can show interstitial ads in cases when your app performs a transition, like a game ends, you go to a new screen or the app resumes after being in the background.

The setup is pretty much the same, the only change is that we now first call prepareInterstitial() which returns a promise. Once this is ready, you can call showInterstitial(), so let’s add this code now:

async showInterstitial() {
  const options: AdOptions = {
    adId: 'YOUR AD ID',
    isTesting: true,
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}
1
2
3
4
5
6
7
8
9
async showInterstitial() {
  const options: AdOptions = {
    adId: 'YOUR AD ID',
    isTesting: true,
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}
Not really a big deal – but now the ad will cover the whole page.

Finally, the type of ad which I think works best in many games, the rewarded video. Creating this ad and displaying it follows the scheme from before as we first call prepareRewardVideoAd() and afterwards showRewardVideoAd(), but now we are also listening to an event!

This is of course mandatory as we need to know whether a user watched a certain ad until the end, so we can give out the according reward like some coins or in game updates.

At this point you even got the possibility to include a ssv object for server-side verification, which means a predefine callback (that you define inside AdMob unit setup!) will be called once a user watched a full reward ad.

Go ahead and add the last missing function like this to display a reward video:

async showRewardVideo() {
  AdMob.addListener(
    RewardAdPluginEvents.Rewarded,
    (reward: AdMobRewardItem) => {
      // Give the reward!
      console.log('REWARD: ', reward);
    }
  );

  const options: RewardAdOptions = {
    adId: 'YOUR ADID',
    isTesting: true,
    // npa: true
    // ssv: { ... }
  };

  await AdMob.prepareRewardVideoAd(options);
  await AdMob.showRewardVideoAd();
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
async showRewardVideo() {
  AdMob.addListener(
    RewardAdPluginEvents.Rewarded,
    (reward: AdMobRewardItem) => {
      // Give the reward!
      console.log('REWARD: ', reward);
    }
  );
 
  const options: RewardAdOptions = {
    adId: 'YOUR ADID',
    isTesting: true,
    // npa: true
    // ssv: { ... }
  };
 
  await AdMob.prepareRewardVideoAd(options);
  await AdMob.showRewardVideoAd();
}
You are now able to display all three major ad types in your Ionic app, event without any real IDs so far.

If you want to test closer to a production app, you should set up the different ad units as described in the beginning.

You can than use those IDs for the options, and additionally you should then include your device for testing with its specific ID so you don’t get a penalty on your ad account if you test live apps inside a development app!

Teardown
Adding ads to your Ionic app is such a breeze with Capacitor that it actually already feels too easy.

You could actually run through most of the testing code without doing a lot inside Google AdMob, and later fill in the missing information to connect your app with real ads from an ad network.

You can also find a video version of this Quick Win below.

# How to send Emails with Ionic using Capacitor [v6]
Posted on April 26th, 2022

ionic-send-emails-capacitor
Tweet
Email
WhatsApp
Share
If you want to pre fill images for users from your Ionic app and send them with their own email client, you should use a simple plugin to make your life easier!

In this Quick Win we will implement sending emails with Ionic inside a Capacitor app. At the time writing, there was no Capacitor plugin available that had the same functionality as the Cordova plugin, so we will learn to integrate the Cordova plugin accordingly with Capacitor!

ionic-send-email-capacitor
In the end we are able to fill an email including an image attachment using the Capacitor camera.

Setting up the Email App
To get started we create a blank new Ionic app and install the Cordova plugin for our email composer. While we previously added the Ionic native package to use the plugin in a better way with Anuglar, we now use the @awesome-cordova-plugins which is the new Ionic native!

If you want to attach images also install the according Capacitor plugin afterwards and add your native platforms:

ionic start academyEmail blank --type=angular
cd ./academyEmail
 
npm install cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer @awesome-cordova-plugins/core

# If you want to capture images
npm install @capacitor/camera
 
ionic build
ionic cap add ios
ionic cap add android
1
2
3
4
5
6
7
8
9
10
11
12
ionic start academyEmail blank --type=angular
cd ./academyEmail
 
npm install cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer @awesome-cordova-plugins/core
 
# If you want to capture images
npm install @capacitor/camera
 
ionic build
ionic cap add ios
ionic cap add android
To use the email composer we now need to add it inside our src/app/app.module.ts to the array of providers like this:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
Finally we need some changes for the native iOS and Android project to make opening the email client possible and also to enable camera access if you want to capture images.

For iOS, we need to include the following permissions and keys inside the ios/App/App/Info.plist:

	<key>LSApplicationQueriesSchemes</key>
	<array>
	<string>mailto</string>
	</array>
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To store images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To get all your images</string>
1
2
3
4
5
6
7
8
9
10
	<key>LSApplicationQueriesSchemes</key>
	<array>
	<string>mailto</string>
	</array>
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To store images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To get all your images</string>
The first entry is for the emails, the other 3 permissions for camera and phot library access.

For Android we need to do the same, so open the android/app/src/main/AndroidManifest.xml and insert in the right places the following:

<manifest ....>
    <queries>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="mailto" />
        </intent>
    </queries>

    <!-- Permissions -->

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
<manifest ....>
    <queries>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="mailto" />
        </intent>
    </queries>
 
    <!-- Permissions -->
 
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
Especially the query part wasn’t completely obvious, but if you inspect the Cordova plugin you can see which magic the config.xml normally does and simply perform the change once right inside your native settings instead if you are using Capacitor!

Creating Emails with Attachements
Now this part is actually quite easy after all the setup. First, let’s create a simple view with some buttons and a card to show the image we captured.

For this, bring up the src/app/home/home.page.html and change it to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Emails </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="checkAccount()">Check account</ion-button>
  <ion-button expand="full" (click)="captureImage()">Capture image</ion-button>
  <ion-button expand="full" *ngIf="hasAccount" (click)="openEmail()">Open Email</ion-button>

  <ion-card>
    <ion-card-header>Current image</ion-card-header>
    <ion-card-content>
      <img [src]="currentImage" *ngIf="currentImage" />
    </ion-card-content>
  </ion-card>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Emails </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="checkAccount()">Check account</ion-button>
  <ion-button expand="full" (click)="captureImage()">Capture image</ion-button>
  <ion-button expand="full" *ngIf="hasAccount" (click)="openEmail()">Open Email</ion-button>
 
  <ion-card>
    <ion-card-header>Current image</ion-card-header>
    <ion-card-content>
      <img [src]="currentImage" *ngIf="currentImage" />
    </ion-card-content>
  </ion-card>
</ion-content>
Now we can first of all check if the user has an email account (or you can also check for installed clients) to make sure you can actually open an email.

I encountered some problems with those functions on Android, so play around with them and log the results to see what the app finds on your device.

Afterwards we can capture an image using the standard Capacitor camera capturing function and use a base64 string as a result.

This result can be used for displaying the image in our template (with some additional information) and later also for the attachments, but with a slightly different syntax so we also store the raw result value inside imageData.

Finally you can create the EmailComposerOptions object to define all relevant information and attachments, or even define an app which should be used to create the email.

Go ahead now and change your src/app/home/home.page.ts to:

import { Component } from '@angular/core';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hasAccount = false;
  currentImage = null;
  imageData = null;

  constructor(private emailComposer: EmailComposer) {}

  async checkAccount() {
    this.hasAccount = await this.emailComposer.hasAccount();
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
    });

    this.imageData = image.base64String;
    this.currentImage = `data:image/jpeg;base64,${image.base64String}`;
  }

  async openEmail() {
    const email: EmailComposerOptions = {
      to: 'saimon@devdactic.com',
      cc: 'simon@ionicacademy.com',
      attachments: [`base64:image.jpg//${this.imageData}`],
      subject: 'My Cool Image',
      body: 'Hey Simon, what do you thing about this image?',
    };

    await this.emailComposer.open(email);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
import { Component } from '@angular/core';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hasAccount = false;
  currentImage = null;
  imageData = null;
 
  constructor(private emailComposer: EmailComposer) {}
 
  async checkAccount() {
    this.hasAccount = await this.emailComposer.hasAccount();
  }
 
  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
    });
 
    this.imageData = image.base64String;
    this.currentImage = `data:image/jpeg;base64,${image.base64String}`;
  }
 
  async openEmail() {
    const email: EmailComposerOptions = {
      to: 'saimon@devdactic.com',
      cc: 'simon@ionicacademy.com',
      attachments: [`base64:image.jpg//${this.imageData}`],
      subject: 'My Cool Image',
      body: 'Hey Simon, what do you thing about this image?',
    };
 
    await this.emailComposer.open(email);
  }
}
Now you can capture an image or check for installed accounts and then open the native client with all the information you specified inside the options object!

Conclusion
At the time writing this tutorial there was one legit Capacitor plugin for this but it lacked attachments, and I’m pretty sure a lot of you need this feature.

If you don’t need to include files than that plugin is even easier, and perhaps we’ll also see attachment support on this plugin in the future.

Otherwise, using a Cordova plugin works fine inside Capacitor projects as well, it simply doesn’t come with a web implementation so you have to test this functionality on a real device!

You can also find a video version of this Quick Win below.

# How to Share Data Between Pages in Ionic Apps using Angular (Part 2/2) [v6]
Posted on February 1st, 2022

In this Quick Win I will show you basic patterns for managing data across pages of your Ionic apps using different techniques.

Within the first part of this mini series we talked a lot about specific Angular routing concepts, and you should certainly go through that post first!

## How to Pass Data Between Pages in Ionic Apps using Angular

Today we will dive into some other concepts, namely:

- Nested routes
- Modals
- Child components
- State management

Let’s get the party started!

## Ionic App Setup
To follow along the examples you need a blank Ionic app, and we will generate some pages later during the different steps:
```bash
ionic start advancedNavigation blank --type=angular
```
Everything else is already included and Ionic or Angular core.

## Nested Wildcard Routes
If you understand how the Angular router works, you can create any kind of nested URL structure as long as there’s a path defined for the URL you try to access.

For this example let’s generate a few new pages first:
```bash
ionic g page lists
ionic g page listDetails
ionic g page items
ionic g page itemDetails
```

Now we define different routes for those pages and include some placeholder inside the URL like :listid or :itemid, so bring up the src/app/app-routing.module.ts and change it to:
```typescript
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'lists',
    loadChildren: () => import('./lists/lists.module').then((m) => m.ListsPageModule),
  },
  {
    path: 'lists/:listid',
    loadChildren: () => import('./list-details/list-details.module').then((m) => m.ListDetailsPageModule),
  },
  {
    path: 'lists/:listid/items',
    loadChildren: () => import('./items/items.module').then((m) => m.ItemsPageModule),
  },
  {
    path: 'lists/:listid/items/:itemid',
    loadChildren: () => import('./item-details/item-details.module').then((m) => m.ItemDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

You can now access each of those nested routes, in our case let’s add all possible options to the src/app/home/home.page.html:
```html
<ion-header>
  <ion-toolbar>
    <ion-title> Home </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button routerLink="/lists" expand="full">Open lists</ion-button>
  <ion-button routerLink="/lists/3" expand="full">Open ist with ID 3</ion-button>
  <ion-button routerLink="/lists/3/items" expand="full">Open list 3 items</ion-button>
  <ion-button routerLink="/lists/3/items/42" expand="full">Open item 42 in list 3</ion-button>
</ion-content>
```
Now on each of those sub pages you got access to the parameters used inside the URL like this inside the src/app/item-details/item-details.page.ts:
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {
  listid = null;
  itemid = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.listid = this.route.snapshot.paramMap.get('listid');
    this.itemid = this.route.snapshot.paramMap.get('itemid');
  }
}
```

If you don’t know how many path components you will have, you might follow the approach we used in my Capacitor file explorer post where we simply extracted everything after the first path as a URI component and then handled it on one page!

Nesting your routes and access the path is no problems – just keep in mind that in the end the path you try to reach is covered by your routing information!

## Passing Data to the Modal
Now let’s talk about something outside of the traditional Angular routing, which is the Ionic modal. You might have to pass data to the modal, back from the modal or even keep an active connection.

We can handle all these things, but first we need another page:
```bash
ionic g page modal
```
The standard way to pass data to a modal is by adding any information you need to the componentProps when opening a new modal.

This could look like the following snippet inside the src/app/home/home.page.ts:
```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private modalCtrl: ModalController) {}

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { userid: 42, filter: true },
    });

    await modal.present();
  }
}
```
On the modal page, we would then simply define variables and use the @Input() decorator from Angular, following the example from before we can define two variables inside the src/app/modal/modal.page.ts:
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() userid: number;
  @Input() filter: boolean;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(`User: ${this.userid} - filter: ${this.filter}`);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
```
That’s really all your need – from the log you can see that we are immediately able to print out the values that we passed to the modal.

## Exchange Data between Modal and Page
The previous data direction is pretty easy and straight forward, and sending data back usually as well.

The only question is whether you need an active connection between page and modal or just need to pass data back on close?

Having a direct connection can be really helpful if yo u are using the Ionic 6 bottom sheet version of a modal, since you could directly update the background page after changes inside the modal page!

If you modal is anyway covering the whole page, then usually sending data back when you dismiss the modal is enough.

Anyway, we’ll implement both now. For an ongoing connection we can use a BehaviorSubject which is a special Observable to which our page can subscribe.

We then pass the created object to our modal using the componentProps just like before, which could look like this inside the src/app/home/home.page.ts:
```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private modalCtrl: ModalController) {}

  async showModal() {
    const mySubject = new BehaviorSubject('myvalue');

    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { subject: mySubject },
    });

    await modal.present();

    mySubject.subscribe((res) => {
      console.log('new value while open: ', res);
    });

    const { data } = await modal.onDidDismiss();
    console.log('Data after modal close: ', data);

    mySubject.unsubscribe();
  }
}
```
Now whenever we change something inside the modal page, we can call next() with the new value on the BehaviorSubject and our “parent” calling page gets the updated value inside the subscribe block!

On top of that we now handle the onDidDismiss() function, through which we get access to any value that was passed back from the modal when it was closed.

We simply need to pass that data to the dismiss() of the modal, as we can see in the src/app/modal/modal.page.ts next to our Observable logic:
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() subject: BehaviorSubject<string>;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    setTimeout(() => {
      this.subject.next('a new hope');
    }, 2000);
  }

  close() {
    this.modalCtrl.dismiss({ myreturnvalue: '42' });
  }
}
```

Now you are able to bring data into the modal and also return it to your calling page!

## Sharing Data between Components
Another case of data flow comes up when you generate custom components, which are usually included in a parent page.

For this scenario we need a new module and a component so let’s generate them:
```bash
ionic g module components/sharedComponents --flat
ionic g component components/textbox
```

To use the component we need to declare and export it in the module, and we also need access to the IonicModule for Ionic components and Angular FormsModule to use data binding.

Therefore, bring up the new src/app/components/shared-components.module.ts and change it to:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxComponent } from './textbox/textbox.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TextboxComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [TextboxComponent],
})
export class SharedComponentsModule {}
```

Passing data to the component works mostly like before by decorating a variable with @Input(), and the sending data back to the parent by using @Output(), but the usage for the second is slightly different.

The output is an EventEmitter, a stream to which we can emit() data just like we did before with our BehaviourSubject.

Let’s add it to our src/app/components/textbox/textbox.component.ts now:
```typescript
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
})
export class TextboxComponent implements OnInit {
  @Input() title: string;
  @Output() textChanged: EventEmitter<string> = new EventEmitter();
  myText = '';

  constructor() {}

  ngOnInit() {}

  inputChanged() {
    this.textChanged.emit(this.myText);
  }
}
```

So when some input changes, we will simply emit the new value somehow to our parent component (or anyone catching the output).

The component itself now simply get’s an input field and uses the input variable for the label of that field, so open the src/app/components/textbox/textbox.component.html and change it to:
```html
<ion-item class="ion-margin">
  <ion-label position="stacked">{{ title }}</ion-label>
  <ion-input [(ngModel)]="myText" (ionChange)="inputChanged()"></ion-input>
</ion-item>
```
That’s all for the component, now we need to import the module in the page where we want to use it, so open up the src/app/home/home.module.ts and add it in there:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedComponentsModule } from '../components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
```

We can now use the component and pass a title to it while adding a function for the textChanged output of the component inside our src/app/home/home.page.html:
```html
<ion-header>
  <ion-toolbar>
    <ion-title> Home </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-card>
    <ion-card-content>
      <app-textbox title="My cool input" (textChanged)="childChanged($event)"></app-textbox>
      <ion-label color="secondary"> Value from child: {{ valueFromChild}} </ion-label>
    </ion-card-content>
  </ion-card>
</ion-content>
```
Additionally we can store the variable in the assigned function, or do whatever we want with the value that is send back to our src/app/home/home.page.ts:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  valueFromChild = '';

  constructor() {}

  childChanged(data) {
    this.valueFromChild = data;
  }
}
```
And now we have covered once again both directions of bringing data into a component as well as listening to changes of the component!

## Simple state management
Finally a quick word on state management as that’s a topic where people usually throw in heavy concepts that might or might not confuse you more than they help.

Managing state isn’t always easy – but it’s also not rocket science.

For most medium size and sometimes even bigger projects, a simple state management based on Subjects is enough. Therefore I want to show you one quick example of a todo list, which holds and manages the whole state of todos inside a service like this:
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private todosSubject = new BehaviorSubject([]);

  constructor() {}

  get todos() {
    return this.todosSubject.asObservable();
  }

  addTodo(newTodo) {
    const todos = this.todosSubject.value;
    todos.push(newTodo);
    this.todosSubject.next(todos);
  }

  removeTodo(index) {
    const todos = this.todosSubject.value;
    todos.splice(index, 1);
    this.todosSubject.next(todos);
  }
}
```

Everything is based on the BehaviorSubject which holds the current state and it’s the single place of truth where we emit new data. If these things look strange to you, I highly recommend you check out our Understanding Promises & Observables course about asynchronous operations!

Now the page that works with this service only calls the according functions of the service and doesn’t care about updating values at all – the only thing we get is the todos connection, to which we can later subscribe from the view:
```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos: Observable<string[]>;
  todo = '';

  constructor(private stateService: StateService) {
    this.todos = this.stateService.todos;
  }

  addTodo() {
    this.stateService.addTodo(this.todo);
    this.todo = '';
  }

  removeTodo(index) {
    this.stateService.removeTodo(index);
  }
}
```

No need to manually reload the data at any point!

As for the view, it becomes reactive as well by using the Angular async pipe to subscribe to the Observable of todos from the service:
```html
<ion-header>
  <ion-toolbar>
    <ion-title> Home </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-item>
    <ion-label>Add todo</ion-label>
    <ion-input [(ngModel)]="todo"></ion-input>
  </ion-item>
  <ion-button (click)="addTodo()" expand="full">Add</ion-button>

  <ion-list>
    <ion-item
      *ngFor="let todo of todos | async; let i = index;"
      (click)="removeTodo(i)">
      {{ todo }}
    </ion-item>
  </ion-list>
</ion-content>
```

This was the smallest possible example I was able to come up with, but it can be applied to almost any other scenario. You might have more Subjects, you might encounter race conditions on app startup – but all of that can be effectively managed with Observables and RxJS operators usually!

Still if you want to take a look at a decent state management library for Angular, you could give NGXS a try!

## Conclusion
Sending data across your app usually follows the same patterns, and after going through this mini series with routing setups and modal/component information you should be able to handle almost any scenario that comes up in your own apps.

If you still got any other case in your apps, leave a comment below and we’ll find a different solution!

You can also find a video version of this Quick Win below.
# How to Setup Deep Links With Capacitor (iOS & Android) [v6]
Posted on January 25th, 2022

deep-links-capacitor
Tweet
Email
WhatsApp
Share
Taking your users directly into your app with a universal link on iOS or App Link on Android is one of the easiest ways to open a specific app of your Ionic page, and becomes a super easy task with Capacitor.

In this post we will integrate these links, also known as deep links for both platforms so we are able to jump right into the app if it is installed.

capacitor-deep-links
For this we won’t need a lot of code, but a bit of additional setup to make those deep links work correctly. In the end, you will be able to open a URL like “www.yourdomain.com/details/22” in the browser and your app will automatically open the right page!

Ionic Deeplink Setup
Let’s begin with the easiest part, which is actually setting up a new Ionic app and generating one details page for testing:

ionic start devdacticLinks blank --type=angular
cd ./devdacticLinks
ionic g page details

ionic build
ionic cap add ios
ionic cap add android
1
2
3
4
5
6
7
ionic start devdacticLinks blank --type=angular
cd ./devdacticLinks
ionic g page details
 
ionic build
ionic cap add ios
ionic cap add android
You can also create the native builds after creating the app since we will have to work with the native files later as well. For this I recommend you put your correct bundle ID into the capacitor.config.json or TS file, because it will be used only during this initial setup.

In my case I used “com.devdactic.deeplinks” as the ID like this inside the file:

{
  "appId": "com.devdactic.deeplinks",
  "appName": "devdacticLinks",
  "webDir": "www",
  "bundledWebRuntime": false
}
1
2
3
4
5
6
{
  "appId": "com.devdactic.deeplinks",
  "appName": "devdacticLinks",
  "webDir": "www",
  "bundledWebRuntime": false
}
Next step is some basic routing, and we will simply make our details page accessible with a wildcard in the URL that we will later use in the deep link to see that our setup works.

Go ahead now and change the src/app/app-routing.module.ts to:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'details/:id',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'details/:id',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
Now we can retrieve the ID information from the URL just like we do in a normal Angular routing scenario on our src/app/details/details.page.ts:

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  id = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  id = '';
 
  constructor(private route: ActivatedRoute) {}
 
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
Finally let’s also display the information we got from the URL on the src/app/details/details.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/"></ion-back-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content> My ID: {{ id }} </ion-content>
1
2
3
4
5
6
7
8
9
10
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/"></ion-back-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content> My ID: {{ id }} </ion-content>
All of this was basic Ionic Angular stuff and by no means related to deep links at all!

The magic now comes from handling the appUrlOpen event, which we can do easily by using Capacitor.

We simply add a listener on this event and from there get access to the URL with which our app was opened from the outside!

Since that URL contains your domain as well, we need to split the URL to remove that part, and then use the rest of the URL for our app routing.

This might be different for your own app since you have other pages or a different routing, but you could also simply add some logic in there and check the different path components of the URL and then route the user to the right place in your app!

Go ahead and change the src/app/app.component.ts to this now:

import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private zone: NgZone) {
    this.initializeApp();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const domain = 'devdactic.com';

        const pathArray = event.url.split(domain);
        // The pathArray is now like ['https://devdactic.com', '/details/42']

        // Get the last element with pop()
        const appPath = pathArray.pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private zone: NgZone) {
    this.initializeApp();
  }
 
  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const domain = 'devdactic.com';
 
        const pathArray = event.url.split(domain);
        // The pathArray is now like ['https://devdactic.com', '/details/42']
 
        // Get the last element with pop()
        const appPath = pathArray.pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });
  }
}
Also notice that we didn’t install a single additional plugin? No more Cordova plugins with specific parameters, everything we need is already available inside the Capacitor App package!

But this was the easy part – now we need some customisation for iOS and Android to actually make deep links work.

iOS Configuration
If you don’t have an app ID created inside your iOS Developer account, now is the time.

First of all you need to be enrolled in the Apple Developer Program, which is also necessary to submit your apps in the end.

Your app needs a valid identifier that you also always need when you submit your app. If you want to create a new one, just go to the identifiers list inside your account and add a new App id.

ios-app-id-deep-links
It’s important to enable Associated Domains for your app id in this screen!

In that screen you need to note 2 things (which you can see in the image above):

The bundle id (app id) you specified
Your Team id
Now we need to create another validation file, which is called apple-app-site-association. Without any ending, only this name!

The content should look like this, but of course insert your team id and bundle ID, for example “12345.com.devdactic.wpapp”:

{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "YOURTEAMID.com.your.bundleid",
                "paths": ["*"]
            }
        ]
    }
}
1
2
3
4
5
6
7
8
9
10
11
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "YOURTEAMID.com.your.bundleid",
                "paths": ["*"]
            }
        ]
    }
}
You can create that file simply anywhere on your computer, it doesn’t have to be inside the project. It doesn’t matter, because it actually needs to be served on your domain!

So the next step is upload the validation file to your hosting.

You can add the file to the same .well-known folder, and your file needs to be accessible on your domain.

You can find my file here: http://devdactic.com/.well-known/apple-app-site-association

The file validates your domain for iOS, and you can also specify which paths should match. I used the * wildcard to match any routes, but if you only want to open certain paths directly in the app you could specify something like “products/*” or event multiple different paths!

If you think you did everything correctly, you can insert your data in this nice testing tool for iOS.

The last step is to add the domains to your Xcode plist. You can do this directly inside Xcode by adding a new entry and using the format “applinks:yourdomain.com“.

ios-capabilities-deep-links
At the end of this tutorial I also share another way to do this kind of customisation directly from code with a cool Capacitor tool.

Note: After going through this process I noticed a bug with Chrome on iOS which you should keep an eye on.

Anyway, that’s already everything we need to create universal links for iOS with Ionic!

Android Configuration
Now we want to make our links work on Android, where the name for these special links is App Links.

We need to take a few steps to verify that we own a URL (just like we did for iOS) and that we have a related app:

Generate a keystore file used to sign your apps (if you haven’t already)
Get the fingerprint from the keystore file
Create/generate an assetlinks.json file
Upload the file to your server
So first step is to create a keystore file and get the fingerprint data. This file is used to sign your app, so perhaps you already have it. Otherwise, go ahead with these:

keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore my-release-key.keystore
1
2
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
keytool -list -v -keystore my-release-key.keystore
Now we can use the cool tool right here to generate our file by adding your domain data and fingerprint data.

android-deep-link-tester
You can paste the generated information into an assetlinks.json file that you need to upload to your domain. The file content has this form:

[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.devdactic.deeplinks",
      "sha256_cert_fingerprints": [
        "CB:2B:..."
      ]
    }
  }
]
1
2
3
4
5
6
7
8
9
10
11
12
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.devdactic.deeplinks",
      "sha256_cert_fingerprints": [
        "CB:2B:..."
      ]
    }
  }
]
In my case, you can see the file at https://devdactic.com/.well-known/assetlinks.json and you need to upload it to the path on your domain of course as well.

Once you have uploaded the file, you can test if everything is fine right within the testing tool again and the result should be a green circle!

The last step is to change your android/app/src/main/AndroidManifest.xml and include and additional intent-filter inside the activity element:

 <activity ....>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="devdactic.com" />
            </intent-filter>
</activity>
1
2
3
4
5
6
7
8
 <activity ....>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="devdactic.com" />
            </intent-filter>
</activity>
Now you just need to build your app and sign it, since I found issues when not signing my app. You can do this by running:

cd ./android
./gradlew assembleRelease 
cd ..

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk devdactic.apk

adb install devdactic.apk
1
2
3
4
5
6
7
8
cd ./android
./gradlew assembleRelease 
cd ..
 
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk devdactic.apk
 
adb install devdactic.apk
Run all the commands and the app will be installed on your connected device.

You could also create a signed APK from Android Studio, just make sure you specify the same keystore file for signing as you used for generating the SHA information in the beginning.

Capacitor Configure for native project settings
We have applied a custom setting for iOS by changing it inside Xcode, but you can also automate a bunch of things with a new tool as well.

If you want to do this in a cooler way, I highly recommend you integrate the new Capacitor configure package and do this from the command line instead. It’s a super helpful tool for customising your native iOS and Android projects!

Get started by installing it inside your project first:

npm i @capacitor/configure
1
npm i @capacitor/configure
Now you can create a config.yaml at the root level of your project with the following content_

vars:
  BUNDLE_ID:
    default: com.devdactic.deeplinks
  PACKAGE_NAME:
    default: com.devdactic.deeplinks

platforms:
  ios:
    targets:
      App:
        bundleId: $BUNDLE_ID

        entitlements:
          - com.apple.developer.associated-domains: ["applinks:devdactic.com"]
  android:
    packageName: $PACKAGE_NAME
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
vars:
  BUNDLE_ID:
    default: com.devdactic.deeplinks
  PACKAGE_NAME:
    default: com.devdactic.deeplinks
 
platforms:
  ios:
    targets:
      App:
        bundleId: $BUNDLE_ID
 
        entitlements:
          - com.apple.developer.associated-domains: ["applinks:devdactic.com"]
  android:
    packageName: $PACKAGE_NAME
Of course you should use your own bundle ID and package name, and insert your domain name for the entitlements.

All you need to do now is run the configure tool with this config by executing:

npx cap-config run config.yaml 
1
npx cap-config run config.yaml 
And voila, the settings you specified in the YAML file are applied to your native projects!

Conclusion
Compared to deep links with Cordova, the process for links with Capacitor is a lot easier since we don’t need any additional plugin and only the core Capacitor functionalities.

Still, the important part remains the setup and verification of your domains for both iOS and Android, so make sure the according testing tools show a green light after uploading your file.

If that’s not the case, this is the place to debug and potentially fix permissions or serving headers for your files so that Android and Apple accept your domain as authorised for deep links!

You can also find a video version of this tutorial below.

# How to Pass Data Between Pages in Ionic Apps using Angular (Part 1/2) [v6]
Posted on January 18th, 2022

pass-data-pages-ionic
Tweet
Email
WhatsApp
Share
We all need to pass data around in our Ionic app, and over time I’ve seen countless problems developers encounter with the Angular router.

In this Quick Win we will go through a bunch of scenarios and examples of how you pass data to different pages:

How to use query params
How to use the Angular router state
How to use route parameter
Working with resolver
Handling back navigation
After going through these examples you should have a decent understanding of how the Angular router works and how you can pass information from one page to the next!

Ionic App Setup
To follow along the examples you need a blank Ionic app and one additional page that we can generate right in the beginning:

ionic start appNavigation blank --type=angular
cd ./appNavigation
ionic g page details
1
2
3
ionic start appNavigation blank --type=angular
cd ./appNavigation
ionic g page details
Everything else is already included as we mostly rely on the Angular router.

Using Query Params
Using query params is the easiest way to pass some information to page, and you see it all the time inside your URL bar. These parameters are added after a questionmark and separated with a &, so a URL with query params could look like:

https://myblog.com/post?post=123&action=edit

It’s visible to the user and we can extract it from the URL easily, but let’s start with an example first.

For this, we can change our src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Navigation </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button (click)="navigateWithParams()" expand="full">Navigate with params</ion-button>
  <ion-button (click)="navigateWithObject()" expand="full">Navigate with params</ion-button>

  <ion-button
    routerLink="/details"
    [queryParams]="{category: 'coolcat', filter: 'framework'}"
    expand="full"
    >Navigate with params from HTML</ion-button
  >
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Navigation </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button (click)="navigateWithParams()" expand="full">Navigate with params</ion-button>
  <ion-button (click)="navigateWithObject()" expand="full">Navigate with params</ion-button>
 
  <ion-button
    routerLink="/details"
    [queryParams]="{category: 'coolcat', filter: 'framework'}"
    expand="full"
    >Navigate with params from HTML</ion-button
  >
</ion-content>
We have two functions attached to the buttons, and the last button has the query params directly inline on the element! The result would be a navigation to /details?category=coolcat&filter=framework".

Basically the same result happens if we trigger the navigateWithParams() function, that uses the Angular router to perform the same operation.

While this works great for simple strings, it becomes more challenging if you want to pass more information inside the query params.

An example of this is the navigateWithObject() function that stringifies a JSON object first and then adds it as query params with a bit different syntax

Go ahead to add these functions to the src/app/home/home.page.ts now:

import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateWithParams() {
    this.router.navigateByUrl('/details?filter=color&category=painting');
  }

  navigateWithObject() {
    // Alternative
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify({ category: 'foo', filter: 'bar' }),
      },
    };
    this.router.navigate(['details'], navigationExtras);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}
 
  navigateWithParams() {
    this.router.navigateByUrl('/details?filter=color&category=painting');
  }
 
  navigateWithObject() {
    // Alternative
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify({ category: 'foo', filter: 'bar' }),
      },
    };
    this.router.navigate(['details'], navigationExtras);
  }
}
To extract the query params from a URL we simply need to inject the ActivatedRoute in our page and retrieve the queryParamMap like this inside the src/app/details/details.page.ts:

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get string params
    const category = this.route.snapshot.queryParamMap.get('category');
    const filter = this.route.snapshot.queryParamMap.get('filter');
    console.log(`category: ${category} - filter: ${filter}`);

    // Get and parse object param
    const value = JSON.parse(this.route.snapshot.queryParamMap.get('special'));
    console.log('value: ', value);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private route: ActivatedRoute) {}
 
  ngOnInit() {
    // Get string params
    const category = this.route.snapshot.queryParamMap.get('category');
    const filter = this.route.snapshot.queryParamMap.get('filter');
    console.log(`category: ${category} - filter: ${filter}`);
 
    // Get and parse object param
    const value = JSON.parse(this.route.snapshot.queryParamMap.get('special'));
    console.log('value: ', value);
  }
}
Now passing simple strings or string arrays is definitely fine, but the third case of using a full object in its stringified form should be avoided: The URL looks horrible and you are potentially exposing secret data in the URL.

There are better ways to pass around bigger objects.

Using the Router State
One way of handling objects or more complex data with navigation is possible with the router state.

This is basically like the memory of the router, where you can store chunks of information and retrieve them later.

Once again, we can use this approach both directly from HTML and also from TS, so let’s begin with the src/app/home/home.page.html and insert:

<ion-content>
  <ion-button (click)="navigateWithState()" expand="full">Navigate with State</ion-button>
  <ion-button routerLink="/details" [state]="{user: {id: 1, name:'Max'} }" expand="full"
    >Navigate with State</ion-button
  >
</ion-content>
1
2
3
4
5
6
<ion-content>
  <ion-button (click)="navigateWithState()" expand="full">Navigate with State</ion-button>
  <ion-button routerLink="/details" [state]="{user: {id: 1, name:'Max'} }" expand="full"
    >Navigate with State</ion-button
  >
</ion-content>
Just like setting the other information we can now add a state object in here and define an object with whatever information we fancy.

From code it looks mostly the same, we only need to wrap the object inside the NavigationExtras and then pass that information along when we open a new URL like this:

import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateWithState() {
    const navigationExtras: NavigationExtras = {
      state: {
        user: {
          id: 42,
          name: 'Simon',
        },
      },
    };
    this.router.navigateByUrl('/details', navigationExtras);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}
 
  navigateWithState() {
    const navigationExtras: NavigationExtras = {
      state: {
        user: {
          id: 42,
          name: 'Simon',
        },
      },
    };
    this.router.navigateByUrl('/details', navigationExtras);
  }
}
Retrieving the data on our target page is now just a call to the Angular router to retrieve the state back:

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;

    const user = routerState.user;
    console.log('my user: ', user);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private router: Router) {}
 
  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
 
    const user = routerState.user;
    console.log('my user: ', user);
  }
}
This option can be used of you already got the full object inside a list and want to simply pass it to a details page.

However, there is one downside: The router state is lost when you refresh the view!

That means when you deploy your app as a website and a user refreshes the page, you end up with an empty page as the state is gone. This might not be a problem if you only target mobile devices, but it’s definitely a downside of using the router state for your navigation.

Navigate with Route Parameter
The most recommended and secure way for navigation is still using route parameter. Unlike the query params, these are part of the URL like:
www.myblog/category/5/post/42

To make this navigation work we need to tell the Angular router exactly which routes exist in our application, and include dynamic data as wildcards inside the routing information. For example this would define three routes, the last having the placeholder :category which matches any value:

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
  },
  {
    path: 'details/:category',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];
1
2
3
4
5
6
7
8
9
10
11
12
13
14
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
  },
  {
    path: 'details/:category',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];
Now we can navigate to that page by including our category in the URL, which again works from HTML and TS:

<ion-content>
  <ion-button (click)="navigateFromCode()" expand="full">Navigate from code</ion-button>
  <ion-button [routerLink]="['/', 'details', 'paintings']" expand="full"
    >Navigate from HTML</ion-button
  >
</ion-content>
1
2
3
4
5
6
<ion-content>
  <ion-button (click)="navigateFromCode()" expand="full">Navigate from code</ion-button>
  <ion-button [routerLink]="['/', 'details', 'paintings']" expand="full"
    >Navigate from HTML</ion-button
  >
</ion-content>
Navigating directly with the router is even possible on two ways, but both will bring us to our destination:

  navigateFromCode() {
    this.router.navigateByUrl('/details/frameworks');
    // Same as
    // const foo = 'paintings';
    // this.router.navigate(['/details', foo]);
  }
1
2
3
4
5
6
  navigateFromCode() {
    this.router.navigateByUrl('/details/frameworks');
    // Same as
    // const foo = 'paintings';
    // this.router.navigate(['/details', foo]);
  }
Now we can easily retrieve the category from the URL on the details page by accessing the paramMap of the active route:

  ngOnInit() {
    // Get parameter
    const category = this.route.snapshot.paramMap.get('category');
    console.log(`category: ${category}`);
  }
1
2
3
4
5
  ngOnInit() {
    // Get parameter
    const category = this.route.snapshot.paramMap.get('category');
    console.log(`category: ${category}`);
  }
This is the most common way to navigate and also makes sure a URL directly works, as there is no state tied to this and the details page can always load the information simply from the URL.

More examples for this pattern could be:

/articles/2: Load the details for an article with the ID 2
/user/42: Show user profile with ID 42
If your previous page or list already holds the full object, this pattern might introduce an additional server request. In those cases you can again look at the previous example, but you will loose the benefit of directly refreshing a specific page.

Using a Resolver
One additional way to prepare data for your next page is using a resolver. The idea is to “resolve” an ID or information and prepare it before the next page becomes active.

By doing this, you can make sure that your next page has the information it needs to display already available when it becomes active as opposed to making an additional request after the page has loaded.

There’s no command to generate a resolver but you can start with a service like this:

ionic g service resolver/dataResolver
1
ionic g service resolver/dataResolver
Inside the resolver you can then access the route just like we did before on the details pages and load some information from Ionic Storage or perform an API request – you could do any kind of asynchronous operation in there.

But you could also have the resolver siply transform or filter some data, so let’s put in a dummy resolver inside the src/app/resolver/data-resolver.service.ts:

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataResolverService implements Resolve<any> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot) {
    const category = route.paramMap.get('category');
    // Do something with the parameter, make HTTP call...
    return ['some', 'cool', 'data'];
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
 
@Injectable({
  providedIn: 'root',
})
export class DataResolverService implements Resolve<any> {
  constructor() {}
 
  resolve(route: ActivatedRouteSnapshot) {
    const category = route.paramMap.get('category');
    // Do something with the parameter, make HTTP call...
    return ['some', 'cool', 'data'];
  }
}
Now we can attach this resolver to a route inside the resolve property of a routing entry like this inside the src/app/app-routing.module.ts:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'home/:category',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
    resolve: {
      myarray: DataResolverService,
    },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from './resolver/data-resolver.service';
 
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'home/:category',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsPageModule),
    resolve: {
      myarray: DataResolverService,
    },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
When we navigate to the specified URL, the resolver becomes active and sets the myarray value before we enter the page.

After that, the value is available on the route inside the data property, and we could load it like this inside the src/app/details/details.page.ts:

  ngOnInit() {
    const data = this.route.snapshot.data.myarray;
    console.log(`my data: ${data}`);

    // Get parameter still works
    const category = this.route.snapshot.paramMap.get('category');
    console.log(`category: ${category}`);
  }
1
2
3
4
5
6
7
8
  ngOnInit() {
    const data = this.route.snapshot.data.myarray;
    console.log(`my data: ${data}`);
 
    // Get parameter still works
    const category = this.route.snapshot.paramMap.get('category');
    console.log(`category: ${category}`);
  }
That means you can now immediately access the value in a safe way.

The downside of this approach is that if you make an API call inside the resolver, it might take a second before your app actually transitions to the next page which can result in a bad user experience, and you might be better off by using a skeleton view and loading the data on that page.

Nonetheless, if you just need to prepare some basic data in a synchronous way this can help to write more fail safe code.

Navigating back with Data
In previous versions of Ionic we were able to navigate back and directly pass some data around, which is not really possible with the current routing in Angular apps anymore.

Still, often you want to perform something after you come back from a certain page, and a super simple approach to this would be storing the data in your localStorage before going back.

Instead of using a default back button you can then also use the Angular router and additionally inject the Ionic NavController to call the setDirection() function.

By doing this, we define the animation for the next routing, and the router will simply consume the specified transition for during the next route change!

We could do it like this inside the src/app/details/details.page.ts:

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private router: Router, private navCtrl: NavController) {}

  ngOnInit() {}

  goHome() {
    localStorage.setItem('myvalue', 'This is the lazy way!');

    this.navCtrl.setDirection('back');
    this.router.navigateByUrl('/home');
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  constructor(private router: Router, private navCtrl: NavController) {}
 
  ngOnInit() {}
 
  goHome() {
    localStorage.setItem('myvalue', 'This is the lazy way!');
 
    this.navCtrl.setDirection('back');
    this.router.navigateByUrl('/home');
  }
}
Now our home page can try and load the data whenever it enters the screen by grabbing the value from localStorage inside the ionViewWillEnter like this:

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateForward() {
    this.router.navigateByUrl('/details');
  }

  ionViewWillEnter() {
    const storedValue = localStorage.getItem('myvalue');
    console.log('Found stored: ', storedValue);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { Component } from '@angular/core';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}
 
  navigateForward() {
    this.router.navigateByUrl('/details');
  }
 
  ionViewWillEnter() {
    const storedValue = localStorage.getItem('myvalue');
    console.log('Found stored: ', storedValue);
  }
}
This is only one way to “pass data back”, and we could also solve this with an additional service that simply holds the value in memory, or a RxJS Subject where we keep track of the state.

Conclusion
These were the most basic ways of passing data around inside Ionic apps using the Angular router, but there are still some more cases we need to explore in a future Quick Win like:

Passing data to modals
Passing data between parent and child component
Share state with a service
If you got a special case in your app or can’t figure out the right way to route with data, just leave a comment below!

You can also find a video version of this Quick Win below.


# Ionic Audio Recording like WhatsApp with Capacitor
Posted on October 26th, 2021


Tweet
Email
WhatsApp
Share
If you want to record audio with Ionic, this previously caused many problems as native recording wasn’t available on all platforms and therefore caused major headache.

In this Quick Win we will use the Capacitor voice recorder plugin to record audio files and store them on our device after recoding.

ionic-audio-recording
After creating a basic version we will take things a step further and also add an Ionic gesture so we can record audio while pressing and holding down a button as seen in the WhatsApp app!

Setting up the Ionic Audio Recorder
To get started we create a blank new Ionic application and add the voice recorder plugin. On top of that we install the Capacitor Filesystem plugin to store and access our audio recordings, and the Haptics plugin for a nice vibration feedback for the gesture in our second part:

ionic start academyVoice blank --type=angular --capacitor
cd ./academyVoice
npm i capacitor-voice-recorder

# To store files and give a haptic feedback
npm i @capacitor/filesystem @capacitor/haptics

# Add native platforms
ionic build
ionic cap add ios
ionic cap add android
1
2
3
4
5
6
7
8
9
10
11
ionic start academyVoice blank --type=angular --capacitor
cd ./academyVoice
npm i capacitor-voice-recorder
 
# To store files and give a haptic feedback
npm i @capacitor/filesystem @capacitor/haptics
 
# Add native platforms
ionic build
ionic cap add ios
ionic cap add android
The plugin works mostly as is, we just need to make sure to set the right permissions for iOS so after adding the native platforms with the command before, go ahead and open the ios/App/App/Info.plist and add the following key and a legit description:

<key>NSMicrophoneUsageDescription</key>
<string>We want to record some audio from you</string>
1
2
<key>NSMicrophoneUsageDescription</key>
<string>We want to record some audio from you</string>
That’s all we need to setup our audio recorder!

Basic Ionic Audio Recording
Before doing any kind of recording, we need to request the permission to access the microphone of the user. You could do this the first time you try to record something or just in general put the requestAudioRecordingPermission() call somewhere – it will only trigger the dialog once anyway.

There are also more methods to check the current state of permissions for even more granular control.

In our example we’ll also start by loading all stored files so we can display a list of them, which is super easy with the Capacitor Filesystem.

When we want to start recording, the only thing we need to call is startRecording(). This function returns a promise but the result will only tell you if the recording started successful – the real result of the recording can be obtained after calling stopRecording().

In that case, we can use the base64 result of the voice recording to write this string directly into a new file.

You can imagine that you could easily upload this string directly to your API or Firebase/Supabase, but having it stored as a file also allows to send it as blob later. Just pick the option that works with your backend of choice.

Now go ahead and begin with the changes inside the src/app/home/home.page.ts:

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { GestureController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  storedFileNames = [];
  recording = false;
  recordingDuration = 0;
  durationDisplay = '';
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef;

  constructor(private gestureCtrl: GestureController) { }

  ngOnInit() {
    this.loadFiles();

    // Request permissions for audio recording
    VoiceRecorder.requestAudioRecordingPermission();
  }

  // Load all stored audio files
  loadFiles() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      this.storedFileNames = result.files;
    });
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    VoiceRecorder.stopRecording()
      .then(async (result: RecordingData) => {
        this.recording = false;
        if (result.value && result.value.recordDataBase64) {
          const recordData = result.value.recordDataBase64;

          const fileName = new Date().getTime() + '.wav';
          await Filesystem.writeFile({
            path: `${fileName}`,
            data: recordData,
            directory: Directory.Data
          });

          this.loadFiles();
        }
      })
      .catch(error => console.log(error))
  }

  ngAfterViewInit() {

  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { GestureController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  storedFileNames = [];
  recording = false;
  recordingDuration = 0;
  durationDisplay = '';
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef;
 
  constructor(private gestureCtrl: GestureController) { }
 
  ngOnInit() {
    this.loadFiles();
 
    // Request permissions for audio recording
    VoiceRecorder.requestAudioRecordingPermission();
  }
 
  // Load all stored audio files
  loadFiles() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      this.storedFileNames = result.files;
    });
  }
 
  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }
 
  stopRecording() {
    if (!this.recording) {
      return;
    }
    VoiceRecorder.stopRecording()
      .then(async (result: RecordingData) => {
        this.recording = false;
        if (result.value && result.value.recordDataBase64) {
          const recordData = result.value.recordDataBase64;
 
          const fileName = new Date().getTime() + '.wav';
          await Filesystem.writeFile({
            path: `${fileName}`,
            data: recordData,
            directory: Directory.Data
          });
 
          this.loadFiles();
        }
      })
      .catch(error => console.log(error))
  }
 
  ngAfterViewInit() {
 
  }
}
For this basic example we can create a super simple testing view like the following inside the src/app/home/home.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Voice Recorder
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-button (click)="startRecording()" expand="full">Start</ion-button>
  <ion-button (click)="stopRecording()" expand="full" color="danger">Stop</ion-button>

  <ion-list>
    <ion-item *ngFor="let f of storedFileNames">
      {{ f }}
    </ion-item>
  </ion-list>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Voice Recorder
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-button (click)="startRecording()" expand="full">Start</ion-button>
  <ion-button (click)="stopRecording()" expand="full" color="danger">Stop</ion-button>
 
  <ion-list>
    <ion-item *ngFor="let f of storedFileNames">
      {{ f }}
    </ion-item>
  </ion-list>
 
</ion-content>
You can now already use the app directly on your device to record audio and see it listed. We will go over playing and deleting the files in the next section.

Note: At the time writing there was no web support for this plugin so you’d have to test it on a device. But there was already an open issue and we’ll likely see browser support very soon as well!

WhatsApp like Press Gesture
Now how can the user press and hold a button while recording? We can create that effect with a simple Ionic gesture!

To do this, we will add a button to a footer element and give it the template reference recordbtn so we can add it to a gesture.

At the same time we can alreada add the play and delete functionality to our view, so let’s quickly change the src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Voice Recorder
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-list>
    <ion-item button *ngFor="let f of storedFileNames" (click)="playFile(f)" detail="false">
      {{ f }}
      <ion-button slot="end" (click)="deleteRecording(f)" fill="clear" color="danger">
        <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-item>
  </ion-list>

</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-row class="ion-align-items-center">
      <ion-col size="10">
        <span *ngIf="!recording">
          Press and hold to record
        </span>
        <span *ngIf="recording">
          {{ durationDisplay }}
        </span>
      </ion-col>
      <ion-col size="2">
        <ion-button fill="clear" #recordbtn>
          <ion-icon name="mic-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-toolbar>
</ion-footer>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Voice Recorder
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-list>
    <ion-item button *ngFor="let f of storedFileNames" (click)="playFile(f)" detail="false">
      {{ f }}
      <ion-button slot="end" (click)="deleteRecording(f)" fill="clear" color="danger">
        <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-item>
  </ion-list>
 
</ion-content>
 
<ion-footer>
  <ion-toolbar>
    <ion-row class="ion-align-items-center">
      <ion-col size="10">
        <span *ngIf="!recording">
          Press and hold to record
        </span>
        <span *ngIf="recording">
          {{ durationDisplay }}
        </span>
      </ion-col>
      <ion-col size="2">
        <ion-button fill="clear" #recordbtn>
          <ion-icon name="mic-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-toolbar>
</ion-footer>
In the first snippet I already added the code to access the viewchild button, so now we just need to create the Ionic gesture for that element.

The whole idea is to start the recording in the onStart event and stop it when the gesture ends!

Those are also the places were we trigger the Haptics to give the user a real haptic feedback that something happened.

On top of that we start a function that simply count’s up the duration and calls itself again every 1 second until we are not recording anymore. Within that function we also format the duration string a bit better so it’s not just a number of seconds but a real duration string.

Now continue with the src/app/home/home.page.ts and add the code for our gesture and additional functions:

ngAfterViewInit() {
    const longPress = this.gestureCtrl.create({
      el: this.recordbtn.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.startRecording();
        this.calculateDuration();
      },
      onEnd: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.stopRecording();
      }
    }, true); // Passing true will run the gesture callback inside of NgZone!

    // Don't forget to enable!
    longPress.enable(true);
  }

  async playFile(fileName) {
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
    });
    const base64Sound = audioFile.data;

    // Simple JS audio play
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  calculateDuration() {
    if (!this.recording) {
      this.recordingDuration = 0;
      this.durationDisplay = '';
      return;
    } else {
      this.recordingDuration += 1;
      const minutes = Math.floor(this.recordingDuration / 60);
      const seconds = (this.recordingDuration % 60).toString().padStart(2, '0');

      this.durationDisplay = `${minutes}:${seconds}`
      setTimeout(() => {
        this.calculateDuration();
      }, 1000);
    }
  }

  async deleteRecording(fileName) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: fileName
    });
    this.loadFiles();
  }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
ngAfterViewInit() {
    const longPress = this.gestureCtrl.create({
      el: this.recordbtn.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.startRecording();
        this.calculateDuration();
      },
      onEnd: ev => {
        Haptics.impact({ style: ImpactStyle.Light });
        this.stopRecording();
      }
    }, true); // Passing true will run the gesture callback inside of NgZone!
 
    // Don't forget to enable!
    longPress.enable(true);
  }
 
  async playFile(fileName) {
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
    });
    const base64Sound = audioFile.data;
 
    // Simple JS audio play
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }
 
  calculateDuration() {
    if (!this.recording) {
      this.recordingDuration = 0;
      this.durationDisplay = '';
      return;
    } else {
      this.recordingDuration += 1;
      const minutes = Math.floor(this.recordingDuration / 60);
      const seconds = (this.recordingDuration % 60).toString().padStart(2, '0');
 
      this.durationDisplay = `${minutes}:${seconds}`
      setTimeout(() => {
        this.calculateDuration();
      }, 1000);
    }
  }
 
  async deleteRecording(fileName) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: fileName
    });
    this.loadFiles();
  }
At this point we’ve also added the play functionality using some basic JS as shown on the voice recorder plugin repository, and the delete function which simply removes the file using the Capacitor Filesystem plugin again.

With all of that in place you can start your recording by pressing down the button, you can see the duration count in the footer and the recording will stop and be stored when you release your finger again!

Conclusion
Recoding voice across iOS and Android was never easier and now works just out of the box. With the addition of the Ionic gesture you can implement a pretty cool voice recording functionality for your next Ionic application!

You can also find a video version of this Quick Win below.

# How to use Angular Virtual Scroll with Ionic [v6]
Posted on September 14th, 2021

angular-virtual-scroll-ionic
Tweet
Email
WhatsApp
Share
Although not yet gone, Ionic v6 deprecates the virtual scroll component so instead of using the Ionic implementation, we now need to use a different component now.

Virtual scroll brings performance improvements when you have a huge amount of data inside a list. By only rendering the visible items plus a buffer at the top and bottom, your app keeps a small memory footprint and cells will be reused when the user scrolls.

angular-virtual-scroll-ionic
Lucky for us, there’s already an Angular virtual scroll component we can use instead of the soon to be removed ion-virtual-scroll!

If you are looking for a different solution that supports pagination, check out the Quick Win on improving your list performance as well.

Starting our virtual scroll Ionic app
To get started we bring up a blank new Ionic app and install the Angular Component Dev Kit (CDK):

ionic start academyScroll blank --type=angular --capacitor
cd ./academyScroll
npm install @angular/cdk
1
2
3
ionic start academyScroll blank --type=angular --capacitor
cd ./academyScroll
npm install @angular/cdk
The Angular CDK comes with many cool components, but today we are only interested in the virtual scroll, so we are importing it in the src/app/home/home.module.ts which is the module of our only page:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
 
import { ScrollingModule } from '@angular/cdk/scrolling';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
That’s all we need for the basic integration and import of the new component.

Adding the virtual scroll component
Now we can use the component in our page, but before we should create an array of some items. Well maybe some and a bit more.

Therefore, open the src/app/home/home.page.ts and create an array like this:

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items = [];
  scrollTo = 120;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private toastCtrl: ToastController) {
    this.items = Array.from({ length: 500 }).map((_, i) => `Item #${i}`);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items = [];
  scrollTo = 120;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
 
  constructor(private toastCtrl: ToastController) {
    this.items = Array.from({ length: 500 }).map((_, i) => `Item #${i}`);
  }
}
Don’t mind the other viewchild imports for now – we gonna see how to use them later.

Now we can create the virtual scroll area and for this, we surround everything that should be inside that virtual scroll with the cdk-virtual-scroll-viewport component.

This is basically like the canvas, and we can now scroll everything we want inside of it. The only thing we need to do is use the *cdkVirtualFor directive instead of the regular Angular loop that we would use!
Besides that, you can have an item, cards, whatever you want in that list.

Let’s see how the basic structure could look like in our src/app/home/home.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic scroll
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-row class="ion-align-items-center">
    <ion-col size="9">
      <ion-searchbar placeholder="Enter index" [(ngModel)]="scrollTo"></ion-searchbar>
    </ion-col>
    <ion-col size="3">
      <ion-button (click)="scrollToIndex()" [disabled]="!scrollTo">Scroll</ion-button>
    </ion-col>
  </ion-row>

  <cdk-virtual-scroll-viewport itemSize="56" minBufferPx="900" maxBufferPx="1350">
    <ion-list>
      <ion-item *cdkVirtualFor="let item of items; let isOdd = odd; let i = index;" 
      tappable (click)="selectItem(item)"
      [class.odd]="isOdd" [class.focus]="scrollTo == i">
        <ion-avatar slot="start">
          <img src="https://loremflickr.com/100/100" />
        </ion-avatar>
        <ion-label>
          {{ item }}
        </ion-label>
      </ion-item>

    </ion-list>

  </cdk-virtual-scroll-viewport>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic scroll
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-row class="ion-align-items-center">
    <ion-col size="9">
      <ion-searchbar placeholder="Enter index" [(ngModel)]="scrollTo"></ion-searchbar>
    </ion-col>
    <ion-col size="3">
      <ion-button (click)="scrollToIndex()" [disabled]="!scrollTo">Scroll</ion-button>
    </ion-col>
  </ion-row>
 
  <cdk-virtual-scroll-viewport itemSize="56" minBufferPx="900" maxBufferPx="1350">
    <ion-list>
      <ion-item *cdkVirtualFor="let item of items; let isOdd = odd; let i = index;" 
      tappable (click)="selectItem(item)"
      [class.odd]="isOdd" [class.focus]="scrollTo == i">
        <ion-avatar slot="start">
          <img src="https://loremflickr.com/100/100" />
        </ion-avatar>
        <ion-label>
          {{ item }}
        </ion-label>
      </ion-item>
 
    </ion-list>
 
  </cdk-virtual-scroll-viewport>
</ion-content>
Our virtual scroll works the best when we specify an itemSize, which in our case is the height of one Ionic item. This makes it easy for the component to calculate how many items should be preloaded and created.

The minBufferPx and maxBufferPx describe how many items should be kept in memory at a time – play around with those values to have a smooth and performant result in your app.

Right now you wouldn’t see anything inside your view as we haven’t defined the size for our virtual viewport, so go ahead and change the src/app/home/home.page.scss to:

cdk-virtual-scroll-viewport {
  height: calc(100% - 68px);
  width: 100%;
}

.odd {
  --ion-item-background: #e2e2e2;
}

.focus {
  --ion-item-background: var(--ion-color-primary);
  --ion-item-color: #fff;
}
1
2
3
4
5
6
7
8
9
10
11
12
13
cdk-virtual-scroll-viewport {
  height: calc(100% - 68px);
  width: 100%;
}
 
.odd {
  --ion-item-background: #e2e2e2;
}
 
.focus {
  --ion-item-background: var(--ion-color-primary);
  --ion-item-color: #fff;
}
If you don’t have any other elements in your page, you can normally use 100% of the height but since we also added a little row at the top, we should calculate a different value for the height in this case.

Besides that I added a class for odd elements, but that’s only some visual sugar.

Scrolling virtual items from code
At this point your virtual scroll should work just fine already, but from questions in the past I know that scrolling to specific items has been a problem.

So let’s tackel that right here as well: We want to jump to a certain index in our list, and becuase that item might not even exist in our DOM when we want to jump, we need to perform that action on the viewchild of our CdkVirtualScrollViewport!

Let’s add some code to our src/app/home/home.page.ts which calls the scrollToIndex() but on that viewchild:

scrollToIndex() {
    if (this.scrollTo > -1) {
        this.viewPort.scrollToIndex(this.scrollTo, 'smooth');
    }
}

async selectItem(item) {
    const toast = await this.toastCtrl.create({
        message: item,
        duration: 2000
    });
    toast.present();
}
1
2
3
4
5
6
7
8
9
10
11
12
13
scrollToIndex() {
    if (this.scrollTo > -1) {
        this.viewPort.scrollToIndex(this.scrollTo, 'smooth');
    }
}
 
async selectItem(item) {
    const toast = await this.toastCtrl.create({
        message: item,
        duration: 2000
    });
    toast.present();
}
With this little trick we are now able to jump to virtual items, and also perform all the other actions listed inside the virtual scroll API!

Conclusion
While it’s sad to see a deprecated Ionic component, the replacement is by no means worse. In fact, this component was made for Angular and is still under development so in case something isn’t working yet, you can hope to see it in the future (plus more performance gains)!

As a comparison to virtual scroll you can also check out the implementation of infinite scroll to improve your lists performance.

You can also find a video version of this Quick Win below.


# How to Customise Ionic 6 Modal and Popover [v6]
Posted on August 31st, 2021

customise-ionic-6-modal-popover
Tweet
Email
WhatsApp
Share
With Ionic 6, styling modals and popovers has changed slightly because you can’t easily access all properties anymore as they are converted to use Shadow DOM now!

But good news, you can still inject styling through the defined CSS variables or Shadow parts.

ionic-6-custom-modals
We will create different stylings for a modal and a popover and use all available (new) shadow parts of these components. At the time writing this I used a v6 beta version – let me know if anything has changed for you in the final version.

Creating an Ionic 6 testing app
We get started with a blank Ionic testing app and add two more pages for our overlays. Additionally, if you are not yet on v6 and want to try the beta you should install the latest Ionic version – but most likely you came here because your app is already using v6 anyway:

ionic start academyOverlays blank --type=angular --capacitor
cd ./academyOverlays

ionic g page myModal
ionic g page myPopover

# if not on v6 yet
npm install @ionic/angular@next
1
2
3
4
5
6
7
8
ionic start academyOverlays blank --type=angular --capacitor
cd ./academyOverlays
 
ionic g page myModal
ionic g page myPopover
 
# if not on v6 yet
npm install @ionic/angular@next
Now continue with the src/app/home/home.page.ts to setup some functions to call a modal or popover using the default functions. Each of them get’s their own special cssClass so we can style them later:

import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MyModalPage } from '../my-modal/my-modal.page';
import { MyPopoverPage } from '../my-popover/my-popover.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalCtrl: ModalController,
    private popoverCtrl: PopoverController) { }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: MyModalPage,
      cssClass: 'small-modal'
    });

    await modal.present();
  }

  async openTransparentModal() {
    const modal = await this.modalCtrl.create({
      component: MyModalPage,
      cssClass: 'transparent-modal'
    });

    await modal.present();
  }

  async openPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MyPopoverPage,
      event: ev,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MyModalPage } from '../my-modal/my-modal.page';
import { MyPopoverPage } from '../my-popover/my-popover.page';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  constructor(private modalCtrl: ModalController,
    private popoverCtrl: PopoverController) { }
 
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: MyModalPage,
      cssClass: 'small-modal'
    });
 
    await modal.present();
  }
 
  async openTransparentModal() {
    const modal = await this.modalCtrl.create({
      component: MyModalPage,
      cssClass: 'transparent-modal'
    });
 
    await modal.present();
  }
 
  async openPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MyPopoverPage,
      event: ev,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
  }
}
Finally some buttons inside the src/app/home/home.page.html to trigger all of our actions:

<ion-header>
  <ion-toolbar color="success">
    <ion-title>
      v6 Overlays
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <ion-button (click)="openModal()" expand="full">Open Modal</ion-button>
  <ion-button (click)="openTransparentModal()" expand="full" color="secondary">Open transparent Modal</ion-button>
  <ion-button (click)="openPopover($event)" expand="full" color="tertiary">Open Popover</ion-button>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
<ion-header>
  <ion-toolbar color="success">
    <ion-title>
      v6 Overlays
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content class="ion-padding">
  <ion-button (click)="openModal()" expand="full">Open Modal</ion-button>
  <ion-button (click)="openTransparentModal()" expand="full" color="secondary">Open transparent Modal</ion-button>
  <ion-button (click)="openPopover($event)" expand="full" color="tertiary">Open Popover</ion-button>
</ion-content>
Nothing fancy or new until here, so let’s get into the details.

Creating a custom modal
To display a little modal (with some actual content) we need to create it, so change your previously generated src/app/my-modal/my-modal.page.ts to:

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.page.html',
  styleUrls: ['./my-modal.page.scss'],
})
export class MyModalPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
 
@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.page.html',
  styleUrls: ['./my-modal.page.scss'],
})
export class MyModalPage implements OnInit {
 
  constructor(private modalCtrl: ModalController) { }
 
  ngOnInit() {
  }
 
  dismiss() {
    this.modalCtrl.dismiss();
  }
 
}
And now a simple view with fake data and a close button at the bottom like this inside the src/app/my-modal/my-modal.page.html:

<ion-content [fullscreen]="true">
  <ion-row>
    <ion-col size="12" *ngFor="let val of [].constructor(15); let i = index" class="ion-text-center">
      Item {{ i }}
    </ion-col>
  </ion-row>
</ion-content>

<ion-footer class="ion-text-center">
  <ion-toolbar>
    <ion-button (click)="dismiss()" fill="clear" color="light">
      <ion-icon name="close-circle" slot="icon-only"></ion-icon>
    </ion-button>
  </ion-toolbar>
</ion-footer>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-content [fullscreen]="true">
  <ion-row>
    <ion-col size="12" *ngFor="let val of [].constructor(15); let i = index" class="ion-text-center">
      Item {{ i }}
    </ion-col>
  </ion-row>
</ion-content>
 
<ion-footer class="ion-text-center">
  <ion-toolbar>
    <ion-button (click)="dismiss()" fill="clear" color="light">
      <ion-icon name="close-circle" slot="icon-only"></ion-icon>
    </ion-button>
  </ion-toolbar>
</ion-footer>
If you want to make this look even better, put the following into the src/app/my-modal/my-modal.page.scss – but all of this is not related to the Ionic 6 changes of a modal, just standard styling:

ion-row {
  margin-top: 10vh;
}

ion-col {
  margin-bottom: 30px;
  color: var(--ion-color-medium);
}

ion-toolbar {
  --background: transparent;
  --border-style: none;

  ion-button {
    ion-icon {
      font-size: 50px;
    }
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
ion-row {
  margin-top: 10vh;
}
 
ion-col {
  margin-bottom: 30px;
  color: var(--ion-color-medium);
}
 
ion-toolbar {
  --background: transparent;
  --border-style: none;
 
  ion-button {
    ion-icon {
      font-size: 50px;
    }
  }
}
Now it get’s interesting:

Because modal and popover now use Shadow DOM we can’t easily inject CSS like before.

Basically they are now what things like card or item were before. You can only use the CSS variables of a component (listed usually inside the documentation of that component) or, if defined, shadow parts.

By targeting a shadow part of a component you can inject standard styling into it without using CSS variables!

For our two modals we can use the ::part(partname) syntax now to inject styling into the available parts which are backdrop and content.

If you also keep those rules under the initial custom selector that you defined as the cssClass when creating the modal, you can use & to apply it correctly. Otherwise you see the default usage commented out at the bottom of the following snippet.

Go ahead and add our new rules to the src/global.scss:

.transparent-modal {
    --background: #0000005c;
  
    &::part(content) {
      backdrop-filter: blur(12px);
    }
  
    ion-content {
      --background: transparent;
    }
  }

.small-modal {
    &::part(backdrop) {
        background-color: #0125f0;
    }
    &::part(content) {
        width: 80%;
        height: 50%;
        margin: auto;
        border-radius: 10px;
    }
}

// Same as above, just different syntax!
// ion-modal.transparent-modal::part(content) {
//   backdrop-filter: blur(12px);
// }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
.transparent-modal {
    --background: #0000005c;
  
    &::part(content) {
      backdrop-filter: blur(12px);
    }
  
    ion-content {
      --background: transparent;
    }
  }
 
.small-modal {
    &::part(backdrop) {
        background-color: #0125f0;
    }
    &::part(content) {
        width: 80%;
        height: 50%;
        margin: auto;
        border-radius: 10px;
    }
}
 
// Same as above, just different syntax!
// ion-modal.transparent-modal::part(content) {
//   backdrop-filter: blur(12px);
// }
With that in place, all rules are applied to our custom modals, and we have used both CSS variables to inject styling as well as parts to use regular CSS in the Shadow DOM components!

Creating a custom popover
Let’s do the same for a popover. First, create the simple view for that popover with some dummy data inside the src/app/my-popover/my-popover.page.html:

<ion-content scrollY="false">
  <ion-list>
    <ion-item *ngFor="let val of [].constructor(20); let i = index">
      Item {{ i }}
    </ion-item>
  </ion-list>
</ion-content>
1
2
3
4
5
6
7
<ion-content scrollY="false">
  <ion-list>
    <ion-item *ngFor="let val of [].constructor(20); let i = index">
      Item {{ i }}
    </ion-item>
  </ion-list>
</ion-content>
For the popover we got the backdrop, arrow and content part available, so we can make use of all three to style different parts (lol) of the popover.

Once again open the src/global.scss and add the following:

.custom-popover {
  --backdrop-opacity: 0.6;
  --max-height: 200px;

  &::part(backdrop) {
    background-color: #000;
  }

  &::part(arrow) {
    --background: red;
  }

  &::part(content) {
    font-weight: 600;
    padding: 50px;
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
.custom-popover {
  --backdrop-opacity: 0.6;
  --max-height: 200px;
 
  &::part(backdrop) {
    background-color: #000;
  }
 
  &::part(arrow) {
    --background: red;
  }
 
  &::part(content) {
    font-weight: 600;
    padding: 50px;
  }
}
While this isn’t the best looking popover I’ve created, it shows the applied styling in all 3 parts of the component!

Conclusion
If you previously targeted some wrapper classes with your custom CSS for a modal or popover, you now need to rewrite that code with Ionic 6 and use the defined parts of a component instead.

But if you follow this practice, it’s again super easy to style all elements of your Ionic components exactly to your needs!

You can also find a video version of this Quick Win below.

# How to Cache Image Files with Ionic & Capacitor [v5]
Posted on June 8th, 2021

cache-image-files-ionic-capacitor
Tweet
Email
WhatsApp
Share
If you want to implement caching inside your Ionic app and want to make sure your images are locally available as well, you can create a simple mechanism to make sure everything is cached automatically!

In this Quick Win we will create a custom image caching component that you can easily integrate into your own projects to automatically unlock caching for all the images you get from an API! If you want to combine it with general JSON caching from responses, also check out the previous tutorial on How to Cache API Responses with Ionic & Capacitor!

cache-image-files-ionic
We don’t need any alternative packages as we can rely on the power and APIs of Capacitor for this one.

Ionic App Setup
To get started, you only need a blank application and a new module and component that will be used for our functionality:

ionic start academyCaching blank --type=angular --capacitor
cd ./academyCaching

ionic g module components/sharedComponents --flat
ionic g component components/cachedImage
1
2
3
4
5
ionic start academyCaching blank --type=angular --capacitor
cd ./academyCaching
 
ionic g module components/sharedComponents --flat
ionic g component components/cachedImage
Since we want to grab some API data, let’s also add the HttpClientModule to our src/app/app.module.ts next:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
 
import { HttpClientModule } from '@angular/common/http';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
Next we gonna see the default behaviour in place.

Default API Calls & Images
We gonna make a simple API call to retrieve some data which also contains links to images. Get started by changing our src/app/home/home.page.ts to:

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  products = [];
  
  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('https://fakestoreapi.com/products').subscribe(res => {
      this.products = res;
    });
  }

  async clearCache() {
    const fileEntries = await Filesystem.readdir({
      directory: FilesystemDirectory.Cache,
      path: 'CACHED-IMG',
    });

    fileEntries.files.map(async f => {
      console.log('Delete: ', f);
      
      await Filesystem.deleteFile({
        directory: FilesystemDirectory.Cache,
        path: `CACHED-IMG/${f}`,
      });
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  products = [];
  
  constructor(private http: HttpClient) {
    this.loadProducts();
  }
 
  loadProducts() {
    this.http.get<any[]>('https://fakestoreapi.com/products').subscribe(res => {
      this.products = res;
    });
  }
 
  async clearCache() {
    const fileEntries = await Filesystem.readdir({
      directory: FilesystemDirectory.Cache,
      path: 'CACHED-IMG',
    });
 
    fileEntries.files.map(async f => {
      console.log('Delete: ', f);
      
      await Filesystem.deleteFile({
        directory: FilesystemDirectory.Cache,
        path: `CACHED-IMG/${f}`,
      });
    });
  }
}
For testing I’ve also added a function to clear our filesystem using the CACHED-IMG folder, which we will reuse in other places again later to store our images.

Usually you want to have these kind of constants inside a service, but since we don’t use one in this Quick Win you will find that string in some places (but not recommended!).

Next, bring up a simple view to display our API data like this inside the src/app/home/home.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Caching
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="clearCache()">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="loadProducts()">Load Products</ion-button>

  <ion-card *ngFor="let p of products">
    <img [src]="p.image" class="ion-padding">
    <ion-card-content>
      <ion-label>
        {{ p.title}}
        <p>{{ p.price | currency:'USD' }}</p>
      </ion-label>
    </ion-card-content>
  </ion-card>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Caching
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="clearCache()">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="loadProducts()">Load Products</ion-button>
 
  <ion-card *ngFor="let p of products">
    <img [src]="p.image" class="ion-padding">
    <ion-card-content>
      <ion-label>
        {{ p.title}}
        <p>{{ p.price | currency:'USD' }}</p>
      </ion-label>
    </ion-card-content>
  </ion-card>
 
</ion-content>
If you now serve the application and check the network tab, you will see that on every API call we get the JSON data but also download about 1mb of images – every single time!
ionic-default-image-loading

Let’s see how we can now improve that mechanism a tiny bit.

Creating an Image Caching Component
To get started we need to make sure we have a folder for our cached images on the filesystem ready, and because it crashed on a mobile device without doing this upfront, you should call that logic right in the beginning inside the src/app/app.component.ts:

import { Component } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor() {
    this.createCacheFolder();
  }

  async createCacheFolder() {
    await Filesystem.mkdir({
      directory: FilesystemDirectory.Cache,
      path: `CACHED-IMG`
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
import { Component } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  constructor() {
    this.createCacheFolder();
  }
 
  async createCacheFolder() {
    await Filesystem.mkdir({
      directory: FilesystemDirectory.Cache,
      path: `CACHED-IMG`
    });
  }
}
If you have a caching service (like in the previous tutorial) I would recommend to move that init logic to the service and just call the service function from your app component instead.

Now we can prepare the module of our shared components so we declare and export the component inside the src/app/components/shared-components.module.ts:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [CachedImageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CachedImageComponent],
})
export class SharedComponentsModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { IonicModule } from '@ionic/angular';
 
@NgModule({
  declarations: [CachedImageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CachedImageComponent],
})
export class SharedComponentsModule { }
Next step is the component itself, which basically needs to do these things:

Call a function when we set the input of the component
Check if we got the image inside our filesystem
Download the file and store it in our folder if we don’t have it
Load the file if we already got it or after we have stored it
To perform our custom function, we can simply create a set function for the input decorator which will then be called with the URL of the image.

We then try to read the file, and since there is no check to see if a file exists, we rely on the catch() block of the read function which means the file doesn’t exist yet.

In that case, we call our storeImage() function which grabs the data of the image as blob, then converts it to a base6t4 string and finally writes it to a file using writeFile(). We do all of that because the write function accepts only a string, so we need to take a few extra steps to download and convert the actual image file.

Once a file is stored, we can read its content from the path and set the base64 to our _src variable which we will use inside our view.

Now open the src/app/components/cached-image/cached-image.component.ts and implement the component like this:

import { Component, Input } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;

const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'cached-img',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})
export class CachedImageComponent {
 
  private _src: string = '';
  @Input() spinner = false;

  constructor() {}
 
  @Input()
  set src(imageUrl: string) {
    this.storeAndLoadImage(imageUrl);
  };
 
  async storeAndLoadImage(imageUrl) {
    
    const imageName = imageUrl.split('/').pop();
    const fileType = imageName.split('.').pop();
 
    Filesystem.readFile({
      directory: FilesystemDirectory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).then(readFile => {
      console.log('Local file!');      
      this._src = `data:image/${fileType};base64,${readFile.data}`;      
    }).catch(async e => {
      await this.storeImage(imageUrl, imageName);      
      Filesystem.readFile({
        directory: FilesystemDirectory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(readFile => {
        console.log('File saved: ', readFile);
        this._src = `data:image/${fileType};base64,${readFile.data}`;      
      }).catch(e => {
        console.log('This should not happen: ', e);
      });
    });
  }
 
  // https://forum.ionicframework.com/t/how-to-download-an-image-then-store-it-on-the-device/199841/2
  async storeImage(url, path) {
    const response = await fetch(`https://api-cors-proxy-devdactic.herokuapp.com/${url}`);
    // convert to a Blob    
    const blob = await response.blob();
    
    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await this.convertBlobToBase64(blob) as string;
    
    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: FilesystemDirectory.Cache
    });
    return savedFile;
  }
 
  // helper function
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
import { Component, Input } from '@angular/core';
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
 
const CACHE_FOLDER = 'CACHED-IMG';
 
@Component({
  selector: 'cached-img',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})
export class CachedImageComponent {
 
  private _src: string = '';
  @Input() spinner = false;
 
  constructor() {}
 
  @Input()
  set src(imageUrl: string) {
    this.storeAndLoadImage(imageUrl);
  };
 
  async storeAndLoadImage(imageUrl) {
    
    const imageName = imageUrl.split('/').pop();
    const fileType = imageName.split('.').pop();
 
    Filesystem.readFile({
      directory: FilesystemDirectory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).then(readFile => {
      console.log('Local file!');      
      this._src = `data:image/${fileType};base64,${readFile.data}`;      
    }).catch(async e => {
      await this.storeImage(imageUrl, imageName);      
      Filesystem.readFile({
        directory: FilesystemDirectory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(readFile => {
        console.log('File saved: ', readFile);
        this._src = `data:image/${fileType};base64,${readFile.data}`;      
      }).catch(e => {
        console.log('This should not happen: ', e);
      });
    });
  }
 
  // https://forum.ionicframework.com/t/how-to-download-an-image-then-store-it-on-the-device/199841/2
  async storeImage(url, path) {
    const response = await fetch(`https://api-cors-proxy-devdactic.herokuapp.com/${url}`);
    // convert to a Blob    
    const blob = await response.blob();
    
    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await this.convertBlobToBase64(blob) as string;
    
    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: FilesystemDirectory.Cache
    });
    return savedFile;
  }
 
  // helper function
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
The template for this component now depends on the src being set, and while that’s not the case we can display any kind of placeholder or loading indicator. To make the component more versatile, you could add more inputs but in our case we are already able to select between a loading spinner or skeleton text by setting the spinner boolean.

Open the src/app/components/cached-image/cached-image.component.html now and change it to:

<img [src]="_src" *ngIf="_src != ''; else loading;">
 
<ng-template #loading>
  <div class="ion-text-center" *ngIf="spinner">
    <ion-spinner></ion-spinner>
  </div>
  <div *ngIf="!spinner">
    <ion-skeleton-text animated style="width: 50%; height: 200px; margin: auto;"></ion-skeleton-text>
  </div>
</ng-template>
1
2
3
4
5
6
7
8
9
10
<img [src]="_src" *ngIf="_src != ''; else loading;">
 
<ng-template #loading>
  <div class="ion-text-center" *ngIf="spinner">
    <ion-spinner></ion-spinner>
  </div>
  <div *ngIf="!spinner">
    <ion-skeleton-text animated style="width: 50%; height: 200px; margin: auto;"></ion-skeleton-text>
  </div>
</ng-template>
We’ve got our component ready and can now replace the regular img tag in our app.

Using the Image Cache Component
To use the component in any of your pages, first open the according module like the src/app/home/home.module.ts in our case and import the shared module:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedComponentsModule } from '../components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
import { SharedComponentsModule } from '../components/shared-components.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
Now we can simply overwrite the previous tag we used and instead use our own caching component which receives the image URL as an input and a boolean for the spinner flag.

Simply change the according line in the src/app/home/home.page.html now:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Caching
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="clearCache()">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="loadProducts()">Load Products</ion-button>

  <ion-card *ngFor="let p of products">
    <cached-img [src]="p.image" class="ion-padding" [spinner]="false"></cached-img>
    <ion-card-content>
      <ion-label>
        {{ p.title}}
        <p>{{ p.price | currency:'USD' }}</p>
      </ion-label>
    </ion-card-content>
  </ion-card>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Caching
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="clearCache()">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="loadProducts()">Load Products</ion-button>
 
  <ion-card *ngFor="let p of products">
    <cached-img [src]="p.image" class="ion-padding" [spinner]="false"></cached-img>
    <ion-card-content>
      <ion-label>
        {{ p.title}}
        <p>{{ p.price | currency:'USD' }}</p>
      </ion-label>
    </ion-card-content>
  </ion-card>
 
</ion-content>
When you now debug your application and check the FileStorage inside the Application tab of the Chrome debugging tools, you will find all your downloaded images listed in there after the first load:
ionic-cached-image-files

With our logs in the component you can also see when it’s downloading the files (first load) and then using the local files afterwards for every future call until you remove the cached image files again.

Conclusion
Implementing your own API caching mechanism isn’t too hard with the available tools for Ionic Storage and the Capacitor filesystem API easily available for both web and mobile versions of your Ionic app.

With just some additional logic and one component we are now able to cache all images in our app that we want by simply replacing an existing img tag with our custom component.

You can also find a video version of this Quick Win below.

# How to Lazy Load Images with Ionic [v5]
Posted on April 27th, 2021

lazy-load-images-ionic
Tweet
Email
WhatsApp
Share
If you want to optimise your Ionic app for performance, applying some basic lazy loading can speed up the loading time of your page and overall improve the user experience.

The idea is to load images only when they become visible if they e.g. appear later down inside your pages.

ionic-lazy-load-images
For this Quick Win we will use the powerful yet super simple ng-lazyload-image package!

Setting up the Lazy Load Ionic App
To get started, simply bring up a new app and install the package:

ionic start academyLazy blank --type=angular --capacitor
cd ./academyLazy

npm install ng-lazyload-image

ionic g page details
1
2
3
4
5
6
ionic start academyLazy blank --type=angular --capacitor
cd ./academyLazy
 
npm install ng-lazyload-image
 
ionic g page details
Additionally I added a page so we can also try out navigation to a new page and loading images with additional options in there.

Super Easy Lazy Loading
To use the package, simply import it in the module of the page where you want to use it. In our case, let’s start by adding it to the src/app/home/home.module.ts:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
 
import { LazyLoadImageModule } from 'ng-lazyload-image';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
For each image we want to use with lazy loading we need an image (what a surprise) and a fallback image that will be shown until the real image is loaded.

We will add two images from Unsplash to our src/app/home/home.page.ts for testing:

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  defaultImage = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713';
  image = 'https://images.unsplash.com/photo-1566837945700-30057527ade0';

  constructor() {}

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
import { Component } from '@angular/core';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  defaultImage = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713';
  image = 'https://images.unsplash.com/photo-1566837945700-30057527ade0';
 
  constructor() {}
 
}
Of course I would highly recommend to use a local image as fallback since you don’t need yet another HTTP call for the fallback image, and you want to display it instantly usually.

Now we can use the two basic and necessary attributes which are defaultImage and lazyLoad on any image within our page.

If you want some additional output during the beginning you can also set the debug property and observe the logs!

Now open the src/app/home/home.page.html and change it to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Lazy Load
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button routerLink="/details" routerDirection="forward" expand="full">
    Open details</ion-button>

  <img [debug]="true" [defaultImage]="defaultImage" [lazyLoad]="image">

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Lazy Load
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button routerLink="/details" routerDirection="forward" expand="full">
    Open details</ion-button>
 
  <img [debug]="true" [defaultImage]="defaultImage" [lazyLoad]="image">
 
</ion-content>
When the page loads, the default image will appear first and the lazy image once it’s ready. Sometimes this can be quite fast so don’t be surprised to not see the fallback image.

In that case you could also enable network throttling within your dev tools to see it more clearly!

Adding Styles
Let’s move on to some customisation. The first thing I would recommend is to make the transition a bit smoother. Perhaps not as smooth as the following CSS animation duration, but that was just to make it more obvious!

You can find out more about the CSS selectors of the package here, but basically you can apply styles for before the image is loaded, when it’s ready or when it has failed.

Go ahead and add the following to your src/app/home/home.page.scss:

img.ng-lazyloaded {
  animation: fadein 1.5s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
img.ng-lazyloaded {
  animation: fadein 1.5s;
}
 
@keyframes fadein {
  from {
    opacity: 0;
  }
 
  to {
    opacity: 1;
  }
}
Now the change between the two images is a lot better already. But always keep in mind that your fallback image should have mostly the same height and width of your real image to prevent flickering!

More Power with Custom Hooks
Now for a basic setup that was pretty fast, and sometimes this might be enough, but there’s a lot more that you can customise with this package.

There are some super powerful hooks that you can customise to your needs for all kind of scenarios that your app might come up with.

In the following example we will overwrite the setup() hook to set the default fallback image, the error image as well as the offset of the page when the image should start loading.

Besides that, we also create a custom loadImage() function to show a toast – usually you could perform your own API call in here and set your necessary auth headers, or convert blob data or do whatever you want when the function to load an image within your page is invoked.

Once you’ve created the custom class which extends IntersectionObserverHooks, you provide it for the LAZYLOAD_IMAGE_HOOKS token inside the array of providers (you might have to add this to your module definition).

Go ahead and change the src/app/details/details.module.ts to the following now:

import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, ToastController } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';

import { DetailsPage } from './details.page';

import { Attributes, IntersectionObserverHooks, LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  toast: any;

  constructor(private toastCtrl: ToastController) {
    super();
  };

  // Change the setup hook with your own default settings
  setup(attributes: Attributes) {
    attributes.offset = 10;
    attributes.defaultImagePath = './assets/academy.jpg';
    attributes.errorImagePath = 'https://i.imgur.com/XkU4Ajf.png';
    return super.setup(attributes);
  }

  // Perform a custum function when loading an image
  loadImage(attributes: Attributes) {
    return from(this.toastCtrl.create({message: 'Start loading...', duration: 2000})).pipe(
      switchMap(toast => toast.present()),
      switchMap(_ => super.loadImage(attributes))
    );
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [DetailsPage],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }]
})
export class DetailsPageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { IonicModule, ToastController } from '@ionic/angular';
 
import { DetailsPageRoutingModule } from './details-routing.module';
 
import { DetailsPage } from './details.page';
 
import { Attributes, IntersectionObserverHooks, LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS } from 'ng-lazyload-image';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
 
@Injectable()
export class LazyLoadImageHooks extends IntersectionObserverHooks {
  toast: any;
 
  constructor(private toastCtrl: ToastController) {
    super();
  };
 
  // Change the setup hook with your own default settings
  setup(attributes: Attributes) {
    attributes.offset = 10;
    attributes.defaultImagePath = './assets/academy.jpg';
    attributes.errorImagePath = 'https://i.imgur.com/XkU4Ajf.png';
    return super.setup(attributes);
  }
 
  // Perform a custum function when loading an image
  loadImage(attributes: Attributes) {
    return from(this.toastCtrl.create({message: 'Start loading...', duration: 2000})).pipe(
      switchMap(toast => toast.present()),
      switchMap(_ => super.loadImage(attributes))
    );
  }
}
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [DetailsPage],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }]
})
export class DetailsPageModule {}
Note that for each hook you overwrite you might have to call the according super() function from the parent class if you don’t want to lose the default functions.

Let’s move on and also make a simply API request to the Unsplash API which returns data and a URL to a random image. Since the fetch() call returns a Promise we need to wrap it with from() and convert it to an Observable in order to later use the Angular async pipe in our view.

Open the src/app/details/details.page.ts and add our simply call like this:

import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  myImage: Observable<any>;

  constructor() { }

  ngOnInit() {
  }

  loadImage() {
    this.myImage = from(fetch('https://source.unsplash.com/random')).pipe(map(data => data.url));
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
 
  myImage: Observable<any>;
 
  constructor() { }
 
  ngOnInit() {
  }
 
  loadImage() {
    this.myImage = from(fetch('https://source.unsplash.com/random')).pipe(map(data => data.url));
  }
}
Now on to the last part, which shows 3 things:

We can use the async pipe with the lazyLoad property
If our image URL returns no image, we have defined a fallback image with our hook that will be displayed
The list only loads the image once we scroll close to it (since we defined the offset) and shows the default image until the actual image is ready
It’s mostly the basic stuff because I don’t think adding a bunch of options to each image will be helpful in the end. For now, go ahead and change the src/app/details/details.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="home"></ion-back-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="loadImage()">Load Image</ion-button>

  <!-- Use the async pipe -->
  <img [lazyLoad]="myImage | async" />

  <ion-card>
    <ion-card-content>
      FAIL?
      <!-- See the fail fallback -->
      <img [lazyLoad]="'abc'">
    </ion-card-content>
  </ion-card>

  <ion-card *ngFor="let num of [].constructor(10); let i = index;">
    <ion-card-content>
      <!--  Use the offset on our list^ -->
      <img [lazyLoad]="'https://images.unsplash.com/photo-1587620962725-abab7fe55159'">
    </ion-card-content>
  </ion-card>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="home"></ion-back-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="loadImage()">Load Image</ion-button>
 
  <!-- Use the async pipe -->
  <img [lazyLoad]="myImage | async" />
 
  <ion-card>
    <ion-card-content>
      FAIL?
      <!-- See the fail fallback -->
      <img [lazyLoad]="'abc'">
    </ion-card-content>
  </ion-card>
 
  <ion-card *ngFor="let num of [].constructor(10); let i = index;">
    <ion-card-content>
      <!--  Use the offset on our list^ -->
      <img [lazyLoad]="'https://images.unsplash.com/photo-1587620962725-abab7fe55159'">
    </ion-card-content>
  </ion-card>
 
</ion-content>
We could also define the default image or the error case on each component, but if you want to use the lazy loaded image directive across your whole application, I would recommend to do it at a central point and not on each image tag.

In case you want to check out all available options, here is the API documentation!

Conclusion
You came here because you want to make your Ionic app more performant, but is lazy loading everything?

No, not really.

It’s an improvement that can work in some scenarios, but once you opt for SSR you step into new issues as you now actually need/want to render all images into the page. But even then, this package has some nice options for SEO and SSR which I haven’t tested so far.

Besides that, in some cases (like giant lists) you might be better off with a virtual scroll implementation. And also, this package is not about caching – all requests will be made again and again, so there’s still some space left to make your Ionic app even better.

You can also find a video version of this Quick Win below.


RECENT QUICK WINS
Building a Native Mobile App with Next.js and Capacitor
Building an Ionic Searchable Select Component with Angular [v6]
Building an Ionic React Side Menu Navigation [v6]
Storing Data in React apps with Ionic Storage [v6]
What’s new in Ionic 6.2
© Ionic Academy | Learn Ionic - 2022

[top](#ionic-academy)
# Image Cropping and Transformation with Ionic Angular
Posted on July 5th, 2022

If you want to transform images that users upload in your app, you can do a lot of cropping and transforming with a super simple package!

In this Quick Win we will use the ngx-image-cropper library to create a simple image transformation app with Ionic Angular to apply some basic changes to a user captured image.

## image-crop-ionic-angular
To make things more fun we will use Capacitor to capture the actual images in our app and use them as the input for our cropper component.

## Starting the Image Crop App
Let’s start with a blank new app and install our cropper package. To use pinch events we also need to install hammerjs – you don’t have to install this if you only want to use the app on the browser though.
```bash
ionic start academyCrop blank --type=angular
cd ./academyCrop

# Install the image cropper package
npm i ngx-image-cropper

# For mobile gestures
npm i hammerjs

# For image capturing
npm i @capacitor/camera

# Add native platforms
ionic cap add ios
ionic cap add android
```

We also already installed the Capacitor camera package, and to use it inside a mobile app we need to ask the user for permissions.

Therefore go ahead and open the ios/App/App/Info.plist after adding the native platforms and add the following keys:
```xml
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To save images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To select images</string>
  ```
  
We now need to do the same for Android, so bring up the android/app/src/main/AndroidManifest.xml and add towards the bottom:
```xml
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    ```
    
Now we are basically finished, but in order to include the HammerJS package we need to add the following line to our src/main.ts:
```typescript
import 'hammerjs';
```
*At least this was required at the time writing this tutorial – probably it works with a different solution (or no HammerJS) in the future.*

## Adding Image Crop Functionality
When you want to include the Cropper component, you first need to import the module so in our case let’s open the src/app/home/home.module.ts and load it like this:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ImageCropperModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
```
You could now also already use the example from the documentation to quickly see in in action.

However, we will take a slightly different path as we will use the camera to capture an image and then use the resulting base64 string as the input for the cropper component.

For this get started with some basic setup in our src/app/home/home.page.ts:
```typescript
import { Component, ViewChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('cropper') cropper: ImageCropperComponent;
  myImage: any = null;
  croppedImage: any = '';
  transform: ImageTransform = {};
  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(private loadingCtrl: LoadingController) {}

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.myImage = `data:image/jpeg;base64,${image.base64String}`;
    this.croppedImage = null;
  }
}
```

We will keep the capture image data in myImage, and once we crop the image we will write it to croppedImage.

Additionally we can access the cropper component as a viewchild, and on that we can call the different functions and set the inputs of our cropper instance.

Let’s implement some of the possible functions right now and add them to our src/app/home/home.page.ts as well:
```typescript
  // Called when cropper is ready
  imageLoaded() {
    this.loadingCtrl.dismiss();
  }

  // Called when we finished editing (because autoCrop is set to false)
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  // We encountered a problem while loading the image
  loadImageFailed() {
    console.log('Image load failed!');
  }

  // Manually trigger the crop
  cropImage() {
    this.cropper.crop();
    this.myImage = null;
  }

  // Discard all changes
  discardChanges() {
    this.myImage = null;
    this.croppedImage = null;
  }

  // Edit the image
  rotate() {
    const newValue = ((this.transform.rotate ?? 0) + 90) % 360;

    this.transform = {
      ...this.transform,
      rotate: newValue,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }
  ```
  
Most of this is pretty basic stuff, the only real interesting observation is the transform object that we update: We will pass this object to our cropper component, and by updating it in our functions we can easily transform the image!

Next step is to add a button to capture an image or discard the process (which simply means to set the input source to null), and we can now also add the image-cropper component to our template.

Go ahead with the following and change the src/app/home/home.page.html to:
```html
<ion-header>
  <ion-toolbar>
    <ion-title> Image Crop </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="cropImage()" *ngIf="myImage">
        <ion-icon slot="icon-only" name="checkmark"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button (click)="selectImage()" expand="full" *ngIf="!myImage"
    >Select image</ion-button
  >

  <image-cropper
    #cropper
    [imageBase64]="myImage"
    [maintainAspectRatio]="true"
    [aspectRatio]="4 / 3"
    format="png"
    [hideResizeSquares]="isMobile"
    [transform]="transform"
    [autoCrop]="false"
    (imageCropped)="imageCropped($event)"
    (loadImageFailed)="loadImageFailed()"
    (imageLoaded)="imageLoaded()"
  ></image-cropper>

  <img [src]="croppedImage" *ngIf="croppedImage" />
</ion-content>
```

Ok quite some options on our component – let’s talk about them:

The imageBase64 is the input source in our case, but you could also use a blob, url or FileEvent
We don’t want to show the resize squares on a mobile device so we use hideResizeSquares
The transform takes the values we define to easily transform the image
By setting autoCrop to false we can manually control when to crop the image
Additionally we catch some outputs to update our view or assign the resulting cropped image
Additionally we now also need a few buttons to trigger our functions, so go ahead and add the following row with buttons above the cropper component:
```html
<ion-row *ngIf="myImage">
  <ion-col size="3" class="ion-text-center">
    <ion-button fill="clear" (click)="rotate()">
      <ion-icon name="refresh" slot="start"></ion-icon> Rotate
    </ion-button>
  </ion-col>
  <ion-col size="3" class="ion-text-center">
    <ion-button fill="clear" (click)="flipHorizontal()"> Flip X </ion-button>
  </ion-col>
  <ion-col size="3" class="ion-text-center">
    <ion-button fill="clear" (click)="flipVertical()"> Flip Y </ion-button>
  </ion-col>
  <ion-col size="3" class="ion-text-center">
    <ion-button fill="clear" (click)="discardChanges()"> Discard </ion-button>
  </ion-col>
</ion-row>
```
For reference let’s also overwrite the two existing CSS variables which you can use to style the overlay and background. For this bring up your src/app/home/home.page.scss and insert:
```css
image-cropper {
  --cropper-outline-color: rgba(0, 0, 0, 0.642);
  --cropper-overlay-color: var(--ion-background-color);
}
```

Now we have a slightly darker overlay, and the background of the cropper component takes the same color as our background. We could also only render the component when we have an input image, but knowing about your options is always a good idea!

## Recap
It’s actually super easy to build an Ionic Angular image crop based on real images captured with Capacitor. If you check out the documentation you will see a different way of using a file input, and you can use simply your preferred way to define the input for the cropper element.

After this, the rest is all the same and you can dive more into aspect ratios or transformations to get the most out of this package.

You can also find a video version of this Quick Win below.
[top](#ionic-academy)
# Sign in with Apple from Angular Apps using Capacitor and Firebase
Posted on June 21st, 2022

sign-in-with-apple-angular
Tweet
Email
WhatsApp
Share
Having Sing in with Apple inside your Angular web and native app is not only an additional comfort for the user, it’s also a requirement for mobile apps these days.

In this Quick Win we will implement Sign in with Apple for both an Angular web application and alter also inside the native app version which we build with Capacitor. By doing this we can use the actual native implementation inside our mobile app later!

sign-in-with-apple-preview
On top of that we’ll use Firebase to directly create user accounts and connect everything to make this work!

Prepare your Firebase Project
Before we dive into the implementation, we need to make sure we actually have a Firebase app configured. If you already got something in place you can of course skip this step.

Otherwise, make sure you are signed up (it’s free) and then hit Add project inside the Firebase console. Give your new app a name, select a region and then create your project!

Once you have created the project you can see the web configuration which looks like this:

ionic-4-firebase-add-to-app
If it’s a new project, click on the web icon below “Get started by adding Firebase to your app” to start a new web app and give it a name, you will see the configuration in the next step now.

Leave this config block open just for reference, it will hopefully be copied automatically later by a schematic.

Additionally we have to enable the database, so select Firestore Database from the menu and click Create database.

ionic-4-firestore
Here we can set the default security rules for our database and because this is a simple tutorial we’ll roll with the test mode which allows everyone access.

Because we want to work with users we also need to go to the Authentication tab, click Get started again and activate the Apple provider.

In the next step we need some information from that page so leave it open for now.

Sign in with Apple Configuration
To add Apple as an authentication provider you need to be enrolled in the Apple Developer Program!

Within your account you can first of all create a new App ID, which is usually required when you build a native iOS application (as we will also do later.

Inside the dialog scroll down and make sure you active the Sign in with Apple capability from the list.
apple-sign-in-id

Once your App ID is registered, you can add another Service ID from the same menu point. Give it a meaningful name and identifier, and enable the sign in method like in the image below.

apple-sign-in-service
When the service is saved you can also click on configure inside it and now register the domains and return URLs for the Apple auth flow.

We can grab these values from Firebase now, by diving into the Apple provider inside the Authentication tab, which you should still have open anyway.

Insert the handler URL that you can easily copy from your project and select your App ID in the top dropdown of that view like in the image below:

apple-sign-in-redirect-setup
Note: If you later host your Angular web app somewhere else you might need to add that domain as well!

For now we just need one more step, and for this we need to select the menu item Keys and register a new which has Sign in with Apple enabled, and our App ID from the beginning selected!

sign-in-apple-service-key
Now you can register that key, and once the process is finished you need to download the file and also note the key id!

This information is not required in Firebase, so go back to your settings for the Apple auth prodiver and fill in the information for your team, the key id and finally the content of the file (the key file) you downloaded before.

firebase-apple-provider
At this point you can only hope you did everything right – but we will soon find out.

Angular App Setup
Let’s bring up an Angular application including routing and generate one new component. You could also start with an Ionic Angular app of course, the integration is basically the same.

ng new academyAuth --routing
cd ./academyAuth

# Generate a component
ng generate component login

# Schematic for adding Firebase and AngularFire
ng add @angular/fire
1
2
3
4
5
6
7
8
ng new academyAuth --routing
cd ./academyAuth
 
# Generate a component
ng generate component login
 
# Schematic for adding Firebase and AngularFire
ng add @angular/fire
In the last step we start the AngularFire schematic, which will add Firebase and also AngularFire to our project.

After that a browser will open to log in with Google, which hopefully reads your list of Firebase apps so you can select the Firebase project and app your created in the beginning!

Follow the wizard and select your Firebase project and make sure you select the web app you created in the beginning as this will copy over the right environment information then.

As a result the schematic will automatically fill your environments/environment.ts file – if not make sure you manually add the Firebase configuration from the first step like this:

export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
1
2
3
4
5
6
7
8
9
10
11
export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
At this point the schematic is pretty good, so if you selected Firestore and auth before they should already appear in your src/app/app.module.ts – if not make sure it now looks like this:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
 
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
 
@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
To route to our new component we can also simply add a new path inside the src/app/app-routing.module.ts like this:

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
 
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
Finally we tell our initial page to only display the router, which means our page should be rendered. For this, delete everything inside the src/app/app.component.html and only keep:

<router-outlet></router-outlet>
1
<router-outlet></router-outlet>
Now our component loads and we can implement then sign in flow.

Sign in with Apple Implementation
Normally we could now use a Capacitor plugin which usually has both a web and native implementation, but at the time writing the plugin we want to use had a bug inside the web version.

That means we will fall back to the Firebase way of triggering the Sign in with Apple popup when we run on the web, and otherwise use our real native code from the Capacitor plugin.

To begin with, let’s create the base for our component inside the src/app/login/login.component.ts:

import { Component, OnInit } from '@angular/core';
import {
  Auth,
  UserCredential,
  User,
  signInWithCredential,
} from '@angular/fire/auth';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { Capacitor } from '@capacitor/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.auth.onAuthStateChanged((userState) => {
      this.user = userState;
    });
  }

  ngOnInit(): void {}

  openSignIn() {
    if (Capacitor.getPlatform() === 'web') {
      this.singInWithAppleWeb();
    } else {
      this.singInWithAppleNative();
    }
  }

  singInWithAppleWeb() {
    // TODO
  }

  singInWithAppleNative() {
    // TODO
  }

  async updateUserData(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);

    let data = {
      email: user.email,
    };

    await setDoc(userDocRef, data, { merge: true });
  }

  logout() {
    this.auth.signOut();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
import { Component, OnInit } from '@angular/core';
import {
  Auth,
  UserCredential,
  User,
  signInWithCredential,
} from '@angular/fire/auth';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { Capacitor } from '@capacitor/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User | null = null;
 
  constructor(private auth: Auth, private firestore: Firestore) {
    this.auth.onAuthStateChanged((userState) => {
      this.user = userState;
    });
  }
 
  ngOnInit(): void {}
 
  openSignIn() {
    if (Capacitor.getPlatform() === 'web') {
      this.singInWithAppleWeb();
    } else {
      this.singInWithAppleNative();
    }
  }
 
  singInWithAppleWeb() {
    // TODO
  }
 
  singInWithAppleNative() {
    // TODO
  }
 
  async updateUserData(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
 
    let data = {
      email: user.email,
    };
 
    await setDoc(userDocRef, data, { merge: true });
  }
 
  logout() {
    this.auth.signOut();
  }
}
I’ve also included a listener to the user state from Firebase and a function that will create a new document inside a users collection after the user has logged in with Apple.

For the view, we just need two buttons and display information for testing, so go ahead with the src/app/login/login.component.html like this:

<div style="margin-top: 100px">
  <button (click)="openSignIn()">Sign in with Apple</button>
  <button (click)="logout()">Logout</button>

  <div *ngIf="user">
    {{ user | json }}
  </div>
</div>
1
2
3
4
5
6
7
8
<div style="margin-top: 100px">
  <button (click)="openSignIn()">Sign in with Apple</button>
  <button (click)="logout()">Logout</button>
 
  <div *ngIf="user">
    {{ user | json }}
  </div>
</div>
Now the actual sign in is pretty easy as we just need to use the according functions from the Firebase SDK and pass the information to our own function after the signup:

singInWithAppleWeb() {
  const provider = new OAuthProvider('apple.com');

  signInWithPopup(this.auth, provider)
    .then((result: UserCredential) => {
      this.updateUserData(result.user);
    })
    .catch((error) => {
      console.log('WEB ERROR: ', error);
    });
}
1
2
3
4
5
6
7
8
9
10
11
singInWithAppleWeb() {
  const provider = new OAuthProvider('apple.com');
 
  signInWithPopup(this.auth, provider)
    .then((result: UserCredential) => {
      this.updateUserData(result.user);
    })
    .catch((error) => {
      console.log('WEB ERROR: ', error);
    });
}
After all the initial setup, this part is more than easy!

Nonetheless your app might not work correctly if you made a mistake along the way. I wish you that it works already at this point, but if not, go check out my video at the end of this tutorial and see how I had to fight with different settings and challenges along the way!

Native Sign in with Apple Dialog
Inside a native app this popup would look awful, so instead we want to use the Sign in with Apple Capacitor plugin for native apps.

For this, simply install the core package and the plugin:

# Install Capacitor core and Apple Sign in Plugin
npm i @capacitor/core @capacitor-community/apple-sign-in
1
2
# Install Capacitor core and Apple Sign in Plugin
npm i @capacitor/core @capacitor-community/apple-sign-in
Now we can use the plugin and call the authorize function with the right settings. This means we now need the iOS App ID (not the service ID!) and again the return URL from Firebase for the options.

With that configured we should be able to retrieve an identity token from Apple, which we can use to call signInWithCredential() on the Firebase SDK which will then create the actual user within Firebase!

Go ahead and implement the function of our component now but use your own values:

singInWithAppleNative() {
  let options: SignInWithAppleOptions = {
    clientId: 'com.your.appid',
    redirectURI: 'https://YOURID.firebaseapp.com/__/auth/handler',
    scopes: 'email',
    state: '12345',
  };

  SignInWithApple.authorize(options)
    .then(async (result: SignInWithAppleResponse) => {
      const provider = new OAuthProvider('apple.com');

      // Create sign in credentials with our token
      const credential = provider.credential({
        idToken: result.response.identityToken,
      });

      // Call the sign in with our created credentials
      const userCredential = await signInWithCredential(
        this.auth,
        credential
      );
      this.updateUserData(userCredential.user);
    })
    .catch((error) => {
      console.log('NATIVE ERROR: ', error);
    });
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
singInWithAppleNative() {
  let options: SignInWithAppleOptions = {
    clientId: 'com.your.appid',
    redirectURI: 'https://YOURID.firebaseapp.com/__/auth/handler',
    scopes: 'email',
    state: '12345',
  };
 
  SignInWithApple.authorize(options)
    .then(async (result: SignInWithAppleResponse) => {
      const provider = new OAuthProvider('apple.com');
 
      // Create sign in credentials with our token
      const credential = provider.credential({
        idToken: result.response.identityToken,
      });
 
      // Call the sign in with our created credentials
      const userCredential = await signInWithCredential(
        this.auth,
        credential
      );
      this.updateUserData(userCredential.user);
    })
    .catch((error) => {
      console.log('NATIVE ERROR: ', error);
    });
}
Right now we don’t have a mobile app to test yet, so let’s setup our native platforms with Capacitor now.

Adding the native iOS App
I’m not 100% sure this is required but in all my tests the app usually worked after doing this: Within your Firebase project go ahead and add an iOS App next to the web config your already have and use the app ID that you defined for the app in the beginning (again, not the service id!).

firebase-ios-config
To build a native app with Capacitor we now need to initialise it in our repository and add the platform we want – in our case first of all iOS.

# Install the Capacitor CLI locally
npm install @capacitor/cli --save-dev

npx cap init

npm install @capacitor/ios
npx cap add ios

# Build the project and open Xcode
ng build
npx cap sync
npx cap open ios
1
2
3
4
5
6
7
8
9
10
11
12
# Install the Capacitor CLI locally
npm install @capacitor/cli --save-dev
 
npx cap init
 
npm install @capacitor/ios
npx cap add ios
 
# Build the project and open Xcode
ng build
npx cap sync
npx cap open ios
Note: If you are using Ionic you only need to add the native platform add this point!

Most likely you will see a warning now, because Capacitor won’t find your build folder. For this we need to touch the capacitor.config.ts and change the webDir to our actual build folder, which in my case was this:

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devdactic.appleauthvideo',
  appName: 'academy-auth',
  webDir: 'dist/academy-auth',
  bundledWebRuntime: false,
};

export default config;
1
2
3
4
5
6
7
8
9
10
import { CapacitorConfig } from '@capacitor/cli';
 
const config: CapacitorConfig = {
  appId: 'com.devdactic.appleauthvideo',
  appName: 'academy-auth',
  webDir: 'dist/academy-auth',
  bundledWebRuntime: false,
};
 
export default config;
After going through these steps your project should have an ios folder and after every build you can now run the npx cap sync command to sync your web folder into the native app!

The last command should have opened Xcode for you as well (if not, make sure it is installed!).

Within Xcode your need to setup your signing information if you never did this before and then select your app id in the Signing & Capabilities tab.

In here we also need our last change: Click the plus and add the Sign in with Apple capability to your project.

sign-in-apple-xcode
At this pint you should be able to deploy the app to your device, trigger the signup dialog and hopefully see a result. If not, don’t worry – check out my video for things that can go wrong and see me figure out the right settings as well!

Reset Sign in with Apple
After going through the process once your Apple ID is connected to the app, which makes some things harder to test.

But you can easily reset this by opening your system preferences on a Mac, go to Apple ID -> Password & Security and under Apps Using Apple ID you can edit these apps and find the name of the app from this tutorial.

sign-in-apple-reset
You can also do this on a mobile device in the same place!

Teardown
It’s possible to integrate Sign in with Apple in Angular applications and at the same time inside a native app using Capacitor.

The process to get there can be frustrating and challenging, as the error messages are sometimes not super helpful.

Nonetheless it’s possible, and you can see prove of it in the video version of this Quick Win below!
[top](#ionic-academy)
# How to Write Unit Tests for your Ionic Angular App
Posted on May 17th, 2022

unit-tests-ionic-angular
Tweet
Email
WhatsApp
Share
Did you ever wonder what the *.spec file that is automatically generated for your pages and services is useful for? Then this tutorial is exactly for you!

The spec file inside your Angular project describes test cases, more specific unit tests for specific functionalities (“units”) of your code.

Running the tests is as easy as writing one command, but writing the tests looks a bit different and requires some general knowledge.

In our Ionic Angular app, everything is set up automatically to use Jasmine as a behaviour driven testing framework that gives us the tool to write easy test cases.

On top of that our tests are executed with the help of Karma, a test runner that runs our defined cases inside a browser window.

Why Unit Tests?
We have one spec file next to every page, component, service or whatever you generate with the Ionic CLI.

The reason is simple: We want to test a specific piece of code within a unit test, and not how our whole system operates!

That means, we should test the smallest possible unit (usually a function) within unit tests, which in the end results in a code coverage percentage that describes how much of our code is covered in unit tests.

In the end, this also means you can rely on those functions to be correct – or if you want to use Test Driven Development (TDD) you could come up with the tests first to describe the behaviour of your app, and then implement the actual code.

However you approach it, writing unit tests in your Ionic Angular application makes your code less prone to errors in the future when you change it, and removes any guessing about whether it works or not.

Enough of the theory, let’s dive into some code!

Creating an Ionic App for testing
We start with a blank new Ionic app and add a few services and a page so we can take a look at different test cases:

ionic start devdacticTests blank --type=angular
cd ./devdacticTests

ionic g page list
ionic g service services/api
ionic g service services/data
ionic g service services/products

npm install @capacitor/storage
1
2
3
4
5
6
7
8
9
ionic start devdacticTests blank --type=angular
cd ./devdacticTests
 
ionic g page list
ionic g service services/api
ionic g service services/data
ionic g service services/products
 
npm install @capacitor/storage
I’ve also installed the Capacitor storage plugin so we can test a real world scenario with dependencies to another package.

Now you can already run the tests, which will automatically update when you change your code:

npm test
1
npm test
This will run the test script of your package.json and open a browser when ready!

ionic-jasmine-tests
We will go through different cases and increase the difficulty along the way while adding the necessary code that we can test.

Testing a Simple Service
The easiest unit test is definitely for a service, as by default the service functionalities usually have a defined scope.

Begin by creating a simple dummy service like this inside the src/app/services/data.service.ts:

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  // Basic Testing
  getTodos(): any[] {
    const result = JSON.parse(localStorage.getItem('todos'));
    return result || [];
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}
 
  // Basic Testing
  getTodos(): any[] {
    const result = JSON.parse(localStorage.getItem('todos'));
    return result || [];
  }
}
We can now test whether the function returns the right elements by changing local storage from our test cases.

Before we get into the actual cases, we need to understand the Angular TestBed: This is almost like a ngModule, but this one is only for testing like a fake module.

We create this module beforeEach so before every test case runs, and we call the inject function to add the service or class we want to test. Later inside pages this will come with some more settings, but for a single service that’s all we need at this point.

Test cases are written almost as you would speak: it should do something and we expect a certain result.

Let’s go ahead and change the src/app/services/data.service.spec.ts to this now:

import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  afterEach(() => {
    service = null;
    localStorage.removeItem('todos');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('return an empty array', () => {
    expect(service.getTodos()).toEqual([]);
  });

  it('return an array with one object', () => {
    const arr = ['First Todo'];
    localStorage.setItem('todos', JSON.stringify(arr));

    expect(service.getTodos()).toEqual(arr);
    expect(service.getTodos()).toHaveSize(1);
  });

  it('return the correct array size', () => {
    const arr = [1, 2, 3, 4, 5];
    localStorage.setItem('todos', JSON.stringify(arr));

    expect(service.getTodos()).toHaveSize(arr.length);
  });
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
 
describe('DataService', () => {
  let service: DataService;
 
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });
 
  afterEach(() => {
    service = null;
    localStorage.removeItem('todos');
  });
 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  it('return an empty array', () => {
    expect(service.getTodos()).toEqual([]);
  });
 
  it('return an array with one object', () => {
    const arr = ['First Todo'];
    localStorage.setItem('todos', JSON.stringify(arr));
 
    expect(service.getTodos()).toEqual(arr);
    expect(service.getTodos()).toHaveSize(1);
  });
 
  it('return the correct array size', () => {
    const arr = [1, 2, 3, 4, 5];
    localStorage.setItem('todos', JSON.stringify(arr));
 
    expect(service.getTodos()).toHaveSize(arr.length);
  });
});
We added three cases, in which we test the getTodos() of our service.

There are several Jasmine matchers and we have only used a few of them to compare the result that we get from the service to a value we expect.

At this point you should see the new cases inside your browser window (if you haven’t started the test command, go back to the beginning), and all of them should be green and just fine.

This is not what I recommend!

If your tests don’t fail in the first place, you can never be sure that you wrote them correctly. They could be green because you made a mistake and they don’t really work like they should. Therefore:

Always make your tests fail first, then add the expected value!

Testing a Service with Promises
The previous case was pretty easy with synchronous functions, but that’s very rarely the reality unless you develop a simple calculator for your CV.

Now we add some more dummy code to the src/app/services/api.service.ts so we can also test asynchronous operations:

import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async getStoredTodos(): Promise<any[]> {
    const data = await Storage.get({ key: 'mytodos' });

    if (data.value && data.value !== '') {
      return JSON.parse(data.value);
    } else {
      return [];
    }
  }

  async addTodo(todo) {
    const todos = await this.getStoredTodos();
    todos.push(todo);
    return await Storage.set({ key: 'mytodos', value: JSON.stringify(todos) });
  }

  async removeTodo(index) {
    const todos = await this.getStoredTodos();
    todos.splice(index, 1);
    return await Storage.set({ key: 'mytodos', value: JSON.stringify(todos) });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
 
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}
 
  async getStoredTodos(): Promise<any[]> {
    const data = await Storage.get({ key: 'mytodos' });
 
    if (data.value && data.value !== '') {
      return JSON.parse(data.value);
    } else {
      return [];
    }
  }
 
  async addTodo(todo) {
    const todos = await this.getStoredTodos();
    todos.push(todo);
    return await Storage.set({ key: 'mytodos', value: JSON.stringify(todos) });
  }
 
  async removeTodo(index) {
    const todos = await this.getStoredTodos();
    todos.splice(index, 1);
    return await Storage.set({ key: 'mytodos', value: JSON.stringify(todos) });
  }
}
Again, just testing this service in isolation is quite easy as we can simply await the results of those calls just like we would do when we call them inside a page.

Go ahead and change the src/app/services/api.service.spec.ts to include some new test cases that handle a Promise:

import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { Storage } from '@capacitor/storage';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(async () => {
    await Storage.clear();
    service = null;
  });

  it('should return an empty array', async () => {
    const value = await service.getStoredTodos();
    expect(value).toEqual([]);
  });

  it('should return the new item', async () => {
    await service.addTodo('buy milk');
    const updated = await service.getStoredTodos();
    expect(updated).toEqual(['buy milk']);
  });

  it('should remove an item', async () => {
    await service.addTodo('buy milk');
    await service.addTodo('buy coffee');
    await service.addTodo('buy ionic');

    const updated = await service.getStoredTodos();
    expect(updated).toEqual(['buy milk', 'buy coffee', 'buy ionic']);

    await service.removeTodo(1);

    const newValue = await service.getStoredTodos();
    expect(newValue).toEqual(['buy milk', 'buy ionic']);
  });
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
import { TestBed } from '@angular/core/testing';
 
import { ApiService } from './api.service';
import { Storage } from '@capacitor/storage';
 
describe('ApiService', () => {
  let service: ApiService;
 
  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });
 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  afterEach(async () => {
    await Storage.clear();
    service = null;
  });
 
  it('should return an empty array', async () => {
    const value = await service.getStoredTodos();
    expect(value).toEqual([]);
  });
 
  it('should return the new item', async () => {
    await service.addTodo('buy milk');
    const updated = await service.getStoredTodos();
    expect(updated).toEqual(['buy milk']);
  });
 
  it('should remove an item', async () => {
    await service.addTodo('buy milk');
    await service.addTodo('buy coffee');
    await service.addTodo('buy ionic');
 
    const updated = await service.getStoredTodos();
    expect(updated).toEqual(['buy milk', 'buy coffee', 'buy ionic']);
 
    await service.removeTodo(1);
 
    const newValue = await service.getStoredTodos();
    expect(newValue).toEqual(['buy milk', 'buy ionic']);
  });
});
Again, it’s easy in this case without any dependencies or long running operations, but we already have a dependency to Capacitor Storage which does work fine, but imagine a usage of the camera – there is no camera when you test!

In those cases you could inject plugin mocks for different services to encapsulate the behaviour and make sure you are testing this specific function without outside dependencies!

Testing a Basic Ionic Page
Now we move on to testing an actual page, so let’s change our src/app/home/home.page.ts in order for it to have at least one function to test:

import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos = [];

  constructor(private dataService: DataService) {}

  loadTodos() {
    this.todos = this.dataService.getTodos();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos = [];
 
  constructor(private dataService: DataService) {}
 
  loadTodos() {
    this.todos = this.dataService.getTodos();
  }
}
The setup for the test is now a bit longer, but the default code already handles the injection into the TestBed for us.

We now also create a fixture element, which has a reference to both the class and the template!

Therefore we are able to extract the component from this fixture after injecting it with createComponent().

Our test cases itself are pretty much the same, as we simply call the function of the page and fake some values for storage.

Go ahead with the src/app/home/home.page.spec.ts and add this now:

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    localStorage.removeItem('todos');
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get an empty array', () => {
    component.loadTodos();
    expect(component.todos).toEqual([]);
  });

  it('set an array with objects', () => {
    const arr = [1, 2, 3, 4, 5];
    localStorage.setItem('todos', JSON.stringify(arr));
    component.loadTodos();
    expect(component.todos).toEqual(arr);
    expect(component.todos).toHaveSize(arr.length);
  });
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
 
import { HomePage } from './home.page';
 
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
 
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
 
  afterEach(() => {
    localStorage.removeItem('todos');
    component = null;
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('get an empty array', () => {
    component.loadTodos();
    expect(component.todos).toEqual([]);
  });
 
  it('set an array with objects', () => {
    const arr = [1, 2, 3, 4, 5];
    localStorage.setItem('todos', JSON.stringify(arr));
    component.loadTodos();
    expect(component.todos).toEqual(arr);
    expect(component.todos).toHaveSize(arr.length);
  });
});
This is once again a very simplified test, and there’s something we need to be careful about:

We want to test the page, not the service – therefore we should in reality fake the behaviour of the service and the value that is returned.

And we can do this using a spy, but before we get into that let’s quickly venture almost into end to end testing…

Testing Pages with Ionic UI elements
As said before, we can access both the class and the template from our fixture element – that means we can also query view elements from our unit test!

To try this, let’s work on our second page and change the src/app/list/list.page.ts to this:

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  todos = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStorageTodos();
  }

  async loadStorageTodos() {
    this.todos = await this.apiService.getStoredTodos();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
 
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  todos = [];
 
  constructor(private apiService: ApiService) {}
 
  ngOnInit() {
    this.loadStorageTodos();
  }
 
  async loadStorageTodos() {
    this.todos = await this.apiService.getStoredTodos();
  }
}
Additionally we create a very simple UI with a card for an empty list or an iteration of all the items like this inside the src/app/list/list.page.html:

<ion-header>
  <ion-toolbar>
    <ion-title>My List</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-card *ngIf="!todos.length">
    <ion-card-content> No todos found </ion-card-content>
  </ion-card>

  <ion-list *ngIf="todos.length > 0">
    <ion-item *ngFor="let t of todos">
      <ion-label>{{ t }}</ion-label>
    </ion-item>
  </ion-list>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
<ion-header>
  <ion-toolbar>
    <ion-title>My List</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-card *ngIf="!todos.length">
    <ion-card-content> No todos found </ion-card-content>
  </ion-card>
 
  <ion-list *ngIf="todos.length > 0">
    <ion-item *ngFor="let t of todos">
      <ion-label>{{ t }}</ion-label>
    </ion-item>
  </ion-list>
</ion-content>
In our tests we can now access the debugElement of the fixture and run different queries against it to see if certain UI elements are present, or even which text exists inside them!

Let’s do this by changing our src/app/list/list.page.spec.ts to this:

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonCard, IonicModule, IonItem } from '@ionic/angular';

import { ListPage } from './list.page';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a card if we have no todos', () => {
    const el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeDefined();
    expect(el.nativeNode.textContent.trim()).toBe('No todos found');
  });

  it('should show todos after setting them', () => {
    const arr = [1, 2, 3, 4, 5];

    let el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeDefined();
    expect(el.nativeNode.textContent.trim()).toBe('No todos found');

    component.todos = arr;

    // Important!
    fixture.detectChanges();

    el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeNull();

    const items = fixture.debugElement.queryAll(By.directive(IonItem));
    expect(items.length).toBe(arr.length);
  });
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonCard, IonicModule, IonItem } from '@ionic/angular';
 
import { ListPage } from './list.page';
 
describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
 
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should show a card if we have no todos', () => {
    const el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeDefined();
    expect(el.nativeNode.textContent.trim()).toBe('No todos found');
  });
 
  it('should show todos after setting them', () => {
    const arr = [1, 2, 3, 4, 5];
 
    let el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeDefined();
    expect(el.nativeNode.textContent.trim()).toBe('No todos found');
 
    component.todos = arr;
 
    // Important!
    fixture.detectChanges();
 
    el = fixture.debugElement.query(By.directive(IonCard));
    expect(el).toBeNull();
 
    const items = fixture.debugElement.queryAll(By.directive(IonItem));
    expect(items.length).toBe(arr.length);
  });
});
And there’s again something to watch out for in our second test case: We need to trigger the change detection manually!

Normally the view of your app updates when the data changes, but that’s not the case inside a unit test.

In our case, we set the array of todos inside the page, and therefore expect that the view now shows a list of IonItem nodes.

However, this only happens after we call detectChanges() on the fixture, so be careful when you access any DOM elements like this.

Overall I don’t think you should have massive UI tests in your unit tests. You can test your Ionic app more easily using Cypress end to end tests!

Testing Pages with Spy
Now we are coming back to the idea from before that we should actually fake the return values of our service to minimize any external dependencies.

The idea is to create a spy for a specific function of our service, and define which result will be returned. When we now call the function of our page that uses the getStoredTodos() from a service, the test will actually use the spy instead of the real service!

That means, we don’t need to worry about the service dependency anymore at this point!

We continue with the testing file for our list from before and now take a look at three different ways to handle asynchronous code using a spy:

Use the Jasmine done() callback to end a Promise
Run our code inside the waitForAsync() zone and use whenStable()
Run our code inside the fakeAsync() zone and manually trigger a tick()
Let’s see the code for this first of all by changing the src/app/list/list.page.spec.ts to this (I simply removed the UI tests):

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonCard, IonicModule, IonItem } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ListPage } from './list.page';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let service: ApiService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(ApiService);
  }));

  it('should load async todos', (done) => {
    const arr = [1, 2, 3, 4, 5];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();

    spy.calls.mostRecent().returnValue.then(() => {
      expect(component.todos).toBe(arr);
      done();
    });
  });

  it('waitForAsync should load async todos', waitForAsync(() => {
    const arr = [1, 2, 3];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();

    fixture.whenStable().then(() => {
      expect(component.todos).toBe(arr);
    });
  }));

  it('fakeAsync should load async todos', fakeAsync(() => {
    const arr = [1, 2];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();
    tick();
    expect(component.todos).toBe(arr);
  }));
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonCard, IonicModule, IonItem } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ListPage } from './list.page';
 
describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let service: ApiService;
 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
 
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
 
    service = TestBed.inject(ApiService);
  }));
 
  it('should load async todos', (done) => {
    const arr = [1, 2, 3, 4, 5];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();
 
    spy.calls.mostRecent().returnValue.then(() => {
      expect(component.todos).toBe(arr);
      done();
    });
  });
 
  it('waitForAsync should load async todos', waitForAsync(() => {
    const arr = [1, 2, 3];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();
 
    fixture.whenStable().then(() => {
      expect(component.todos).toBe(arr);
    });
  }));
 
  it('fakeAsync should load async todos', fakeAsync(() => {
    const arr = [1, 2];
    const spy = spyOn(service, 'getStoredTodos').and.returnValue(
      Promise.resolve(arr)
    );
    component.loadStorageTodos();
    tick();
    expect(component.todos).toBe(arr);
  }));
});
The first way is basically the default Jasmine way, and the other two are more Angular like.

Both of them are just fine, the waitForAsync simply waits until all Promises are finished and then we can run our matcher.

In the fakeAsync we manually trigger the passage of time, and the code flow now looks more like when you are using async/await.

Feel free to try both and use the one you feel more comfortable with!

PS: You could already inject the spy directly into the TestBed to define functions that the spy will mock!

Testing Services with Http Calls
Alright we increased the complexity and difficulty along this tutorial and now reach the end, which I’m pretty sure you were waiting for!

To test HTTP calls we first of all need to write some code that actually performs a call, so begin by updating the src/app/app.module.ts to inject the HttpClientModule as always (this is not related to the actual test case!):

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
Now bring up the src/app/services/products.service.ts and add this simple HTTP call:

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get('https://fakestoreapi.com/products');
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
 
  getProducts() {
    return this.http.get('https://fakestoreapi.com/products');
  }
}
To test this function, we ned to create a whole HTTP testing environment because we don’t want to perform an actual HTTP call inside our test! This would take time and change your backend, and we just want to make sure the function sends out the call and returns some kind of data that we expect from the API.

To get started we now need to import the HttpClientTestingModule in our TestBed, and also inject the HttpTestingController to which we keep a reference.

Now we can define a mockResponse that will be sent back from our fake HTTp client, and then simply call the according getProducts() like we would normally and handle the Observable.

Inside the subscribe block we can compare the result we get to our mock response, because that’s what we will actually receive in this test case!

How?

The magic is in the lines below it, but let’s add the code to our src/app/services/products.service.spec.ts first of all:

import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an API call', () => {
    const mockResponse = [
      {
        id: 1,
        title: 'Simons Product',
        price: 42.99,
        description: 'Epic product test',
      },
    ];

    service.getProducts().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toHaveSize(1);
      const product = res[0];
      expect(product).toBe(mockResponse[0]);
    });

    const mockRequest = httpTestingController.expectOne(
      'https://fakestoreapi.com/products'
    );

    expect(mockRequest.request.method).toEqual('GET');

    // Resolve with our mock data
    mockRequest.flush(mockResponse);
  });
});
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
import { TestBed } from '@angular/core/testing';
 
import { ProductsService } from './products.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
 
describe('ProductsService', () => {
  let service: ProductsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
 
  afterEach(() => {
    httpTestingController.verify();
  });
 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  it('should make an API call', () => {
    const mockResponse = [
      {
        id: 1,
        title: 'Simons Product',
        price: 42.99,
        description: 'Epic product test',
      },
    ];
 
    service.getProducts().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toHaveSize(1);
      const product = res[0];
      expect(product).toBe(mockResponse[0]);
    });
 
    const mockRequest = httpTestingController.expectOne(
      'https://fakestoreapi.com/products'
    );
 
    expect(mockRequest.request.method).toEqual('GET');
 
    // Resolve with our mock data
    mockRequest.flush(mockResponse);
  });
});
We can create a fake request using the httpTestingController and already add one expectation about the URL that should be called and the request method.

Finally we can let the client return our mockResponse by calling the flush() function.

So what’s happening under the hood?

The getProducts() from our service is called
The function wants to make an HTTP call to the defined URL
The HTTP testing module intercepts this call
The HTTP testing controller returns some fake data
The getProducts() returns this data thinking it made a real API call
We can compare the mock response to the result of the service function!
It’s all a bit tricky, but a great way to even test the API call functions of your app.

Get you Ionic Test Code Coverage
Finally if you’re interested in metrics or want to present them for your team, you should run the following command:

ng test --no-watch --code-coverage
1
ng test --no-watch --code-coverage
This will generate a nice code coverage report in which you can see how much of your code is covered by tests.
ionic-angular-code-coverage

In our simple example we managed to get 100% coverage – how much will your company get?

[top](#ionic-academy)

# How to send Emails with Ionic using Capacitor [v6]
Posted on April 26th, 2022

ionic-send-emails-capacitor
Tweet
Email
WhatsApp
Share
If you want to pre fill images for users from your Ionic app and send them with their own email client, you should use a simple plugin to make your life easier!

In this Quick Win we will implement sending emails with Ionic inside a Capacitor app. At the time writing, there was no Capacitor plugin available that had the same functionality as the Cordova plugin, so we will learn to integrate the Cordova plugin accordingly with Capacitor!

ionic-send-email-capacitor
In the end we are able to fill an email including an image attachment using the Capacitor camera.

Setting up the Email App
To get started we create a blank new Ionic app and install the Cordova plugin for our email composer. While we previously added the Ionic native package to use the plugin in a better way with Anuglar, we now use the @awesome-cordova-plugins which is the new Ionic native!

If you want to attach images also install the according Capacitor plugin afterwards and add your native platforms:

ionic start academyEmail blank --type=angular
cd ./academyEmail
 
npm install cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer @awesome-cordova-plugins/core

# If you want to capture images
npm install @capacitor/camera
 
ionic build
ionic cap add ios
ionic cap add android
1
2
3
4
5
6
7
8
9
10
11
12
ionic start academyEmail blank --type=angular
cd ./academyEmail
 
npm install cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer @awesome-cordova-plugins/core
 
# If you want to capture images
npm install @capacitor/camera
 
ionic build
ionic cap add ios
ionic cap add android
To use the email composer we now need to add it inside our src/app/app.module.ts to the array of providers like this:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
Finally we need some changes for the native iOS and Android project to make opening the email client possible and also to enable camera access if you want to capture images.

For iOS, we need to include the following permissions and keys inside the ios/App/App/Info.plist:

	<key>LSApplicationQueriesSchemes</key>
	<array>
	<string>mailto</string>
	</array>
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To store images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To get all your images</string>
1
2
3
4
5
6
7
8
9
10
	<key>LSApplicationQueriesSchemes</key>
	<array>
	<string>mailto</string>
	</array>
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To store images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To get all your images</string>
The first entry is for the emails, the other 3 permissions for camera and phot library access.

For Android we need to do the same, so open the android/app/src/main/AndroidManifest.xml and insert in the right places the following:

<manifest ....>
    <queries>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="mailto" />
        </intent>
    </queries>

    <!-- Permissions -->

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
<manifest ....>
    <queries>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="mailto" />
        </intent>
    </queries>
 
    <!-- Permissions -->
 
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
Especially the query part wasn’t completely obvious, but if you inspect the Cordova plugin you can see which magic the config.xml normally does and simply perform the change once right inside your native settings instead if you are using Capacitor!

Creating Emails with Attachements
Now this part is actually quite easy after all the setup. First, let’s create a simple view with some buttons and a card to show the image we captured.

For this, bring up the src/app/home/home.page.html and change it to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Emails </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="checkAccount()">Check account</ion-button>
  <ion-button expand="full" (click)="captureImage()">Capture image</ion-button>
  <ion-button expand="full" *ngIf="hasAccount" (click)="openEmail()">Open Email</ion-button>

  <ion-card>
    <ion-card-header>Current image</ion-card-header>
    <ion-card-content>
      <img [src]="currentImage" *ngIf="currentImage" />
    </ion-card-content>
  </ion-card>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Emails </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="checkAccount()">Check account</ion-button>
  <ion-button expand="full" (click)="captureImage()">Capture image</ion-button>
  <ion-button expand="full" *ngIf="hasAccount" (click)="openEmail()">Open Email</ion-button>
 
  <ion-card>
    <ion-card-header>Current image</ion-card-header>
    <ion-card-content>
      <img [src]="currentImage" *ngIf="currentImage" />
    </ion-card-content>
  </ion-card>
</ion-content>
Now we can first of all check if the user has an email account (or you can also check for installed clients) to make sure you can actually open an email.

I encountered some problems with those functions on Android, so play around with them and log the results to see what the app finds on your device.

Afterwards we can capture an image using the standard Capacitor camera capturing function and use a base64 string as a result.

This result can be used for displaying the image in our template (with some additional information) and later also for the attachments, but with a slightly different syntax so we also store the raw result value inside imageData.

Finally you can create the EmailComposerOptions object to define all relevant information and attachments, or even define an app which should be used to create the email.

Go ahead now and change your src/app/home/home.page.ts to:

import { Component } from '@angular/core';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hasAccount = false;
  currentImage = null;
  imageData = null;

  constructor(private emailComposer: EmailComposer) {}

  async checkAccount() {
    this.hasAccount = await this.emailComposer.hasAccount();
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
    });

    this.imageData = image.base64String;
    this.currentImage = `data:image/jpeg;base64,${image.base64String}`;
  }

  async openEmail() {
    const email: EmailComposerOptions = {
      to: 'saimon@devdactic.com',
      cc: 'simon@ionicacademy.com',
      attachments: [`base64:image.jpg//${this.imageData}`],
      subject: 'My Cool Image',
      body: 'Hey Simon, what do you thing about this image?',
    };

    await this.emailComposer.open(email);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
import { Component } from '@angular/core';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hasAccount = false;
  currentImage = null;
  imageData = null;
 
  constructor(private emailComposer: EmailComposer) {}
 
  async checkAccount() {
    this.hasAccount = await this.emailComposer.hasAccount();
  }
 
  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera, // Camera, Photos or Prompt!
    });
 
    this.imageData = image.base64String;
    this.currentImage = `data:image/jpeg;base64,${image.base64String}`;
  }
 
  async openEmail() {
    const email: EmailComposerOptions = {
      to: 'saimon@devdactic.com',
      cc: 'simon@ionicacademy.com',
      attachments: [`base64:image.jpg//${this.imageData}`],
      subject: 'My Cool Image',
      body: 'Hey Simon, what do you thing about this image?',
    };
 
    await this.emailComposer.open(email);
  }
}
Now you can capture an image or check for installed accounts and then open the native client with all the information you specified inside the options object!

Conclusion
At the time writing this tutorial there was one legit Capacitor plugin for this but it lacked attachments, and I’m pretty sure a lot of you need this feature.

If you don’t need to include files than that plugin is even easier, and perhaps we’ll also see attachment support on this plugin in the future.

Otherwise, using a Cordova plugin works fine inside Capacitor projects as well, it simply doesn’t come with a web implementation so you have to test this functionality on a real device!

[top](#ionic-academy)

# How to add Google Sign In using Capacitor to your Ionic App [v6]
Posted on March 1st, 2022


Tweet
Email
WhatsApp
Share
If you need a social sign in inside your Ionic app, adding Capacitor Google sign in is actually a breeze to implement after some initial configuration.

Google sign in is one of the most common social authentication providers besides
Sign in with Apple that iOS apps need to support, and we can set it up directly with Capacitor with just a bit of set up.

capacitor-google-sign-in
In this Quick Win we will go through the whole configuration process by directly using the Google Cloud APIs without even creating a Firebase project. If you are already using Firebase, check out the initial steps for Firebase in the now depricated post about Google Sign In with Capacitor.

In the end we will be able to perform the authentication on the web, iOS and Android!

Google Cloud Project Configuration
Let’s begin by configuring a Google project. We need this to get the credentials with which we connect to Google and present the right information to the user.

Get started b creating a new project inside the Google Cloud Platform (or use an existing if you already got one).

After the project is ready make sure you select it from the top dropdown, and then dive into the APIs & Services entry inside the side menu.

google-cloud-project
Here we need to first configure the OAuth consent screen, and afterwards create the credentials.

Just insert an app name and support email for the consent, and you can leave the rest of the steps in the process as they are. I also recommend you publish the consent after creating it – having it in testing mode let to problems on Android!

Adding Web Credentials
Now we want to create some credentials for our sign in process, so navigate to the Credentials screen and click Create credentials at the top. Select OAuth client ID in the menu that appears!

And we will actually create one credential for every platform so you can later easily manage them. For now we will go with just the web part.

Start by adding a web application, give it a name and most importantly for debugging, add http://localhost:8100 to the Authorized JavaScript origins
google-sign-in-web-app

In that image I actually used a wrong port which led to a lot of debugging and generating a new key in the end – so use the right port that your app is using, or also the domain if you host the Ionic app as a website later!

In the end a popup shows your Client ID, you can leave it open or simply grab the ID from the overview list as well. With that first credential in place we can continue with our app setup.

Ionic App Setup
We can quickly bring up a new Ionic application now and install the Capacitor community plugin for Google Sign in like this:

ionic start academyLogin blank --type=angular
cd academyLogin

npm i @codetrix-studio/capacitor-google-auth
1
2
3
4
ionic start academyLogin blank --type=angular
cd academyLogin
 
npm i @codetrix-studio/capacitor-google-auth
Now we need to copy the Client ID that we saw after creating the credentials, and you should also add your right app id or bundle id into the capacitor.config.json like this:

{
  "appId": "com.your.appid",
  "appName": "accademyLogin",
  "webDir": "www",
  "bundledWebRuntime": false,
  "plugins": {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "serverClientId": "xxxxxx-xxxxxxx.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
{
  "appId": "com.your.appid",
  "appName": "accademyLogin",
  "webDir": "www",
  "bundledWebRuntime": false,
  "plugins": {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "serverClientId": "xxxxxx-xxxxxxx.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
}
The app or bundle ID is used for publishing your app for iOS and Android later, but it’s also important to correctly configure the Google Sign in for the native platforms later.

For now we also need to add the previously used Google Client ID into the head tag of the src/index.html like this:

    <meta name="google-signin-client_id" content="xxx-xxx.apps.googleusercontent.com" />
    <meta name="google-signin-scope" content="profile email" />
1
2
    <meta name="google-signin-client_id" content="xxx-xxx.apps.googleusercontent.com" />
    <meta name="google-signin-scope" content="profile email" />
Don’t mind that it’s called serverClientId or google-signin-client_id, it’s the client ID you see in your OAuth 2.0 Client IDs list!

Now we can finally run the first build and add our native platforms:

ionic build
ionic cap add ios
ionic cap add android
1
2
3
ionic build
ionic cap add ios
ionic cap add android
Before we configure those platforms, we first add the actual sign in code – which is super easy!

Adding the Google Sign in Functionality
The plugin we use comes with a handful of functions, so let’s simply add them to our src/app/home/home.page.ts right now:

import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = null;

  constructor() {
    if (!isPlatform('capacitor')) {
      GoogleAuth.init();
    }
  }

  async signIn() {
    this.user = await GoogleAuth.signIn();
    console.log('user: ', this.user);
  }

  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
    // { accessToken: 'xxx', idToken: 'xxx' }
  }

  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = null;
 
  constructor() {
    if (!isPlatform('capacitor')) {
      GoogleAuth.init();
    }
  }
 
  async signIn() {
    this.user = await GoogleAuth.signIn();
    console.log('user: ', this.user);
  }
 
  async refresh() {
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
    // { accessToken: 'xxx', idToken: 'xxx' }
  }
 
  async signOut() {
    await GoogleAuth.signOut();
    this.user = null;
  }
}
On the web we need to call the init() function, which in a previous release was also called initialize(). However I noticed that this caused problems on Android or iOS, so we only perform it on the web.

The rest is standard usage of the functions. We can sign in our user to trigger the auth flow, and we can refresh the token which gives us some basic information about the auth token back!

Let’s now quickly connect that to some buttons and an item to display the user information after a sign in within the src/app/home/home.page.html:

<ion-header>
  <ion-toolbar>
    <ion-title> Google Auth </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="full" (click)="signIn()" *ngIf="!user"> <ion-icon name="logo-google" slot="start"></ion-icon> Sign in with Google</ion-button>
  <ion-button expand="full" (click)="signOut()" *ngIf="user"> Sign out</ion-button>
  <ion-button expand="full" (click)="refresh()" *ngIf="!user"> Try refresh</ion-button>

  <ion-item *ngIf="user">
    <ion-avatar slot="start">
      <img [src]="user.imageUrl" />
    </ion-avatar>
    <ion-label>
      {{user.givenName }} {{ user.familyName }}
      <p>{{ user.email }}</p>
    </ion-label>
  </ion-item>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
<ion-header>
  <ion-toolbar>
    <ion-title> Google Auth </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="full" (click)="signIn()" *ngIf="!user"> <ion-icon name="logo-google" slot="start"></ion-icon> Sign in with Google</ion-button>
  <ion-button expand="full" (click)="signOut()" *ngIf="user"> Sign out</ion-button>
  <ion-button expand="full" (click)="refresh()" *ngIf="!user"> Try refresh</ion-button>
 
  <ion-item *ngIf="user">
    <ion-avatar slot="start">
      <img [src]="user.imageUrl" />
    </ion-avatar>
    <ion-label>
      {{user.givenName }} {{ user.familyName }}
      <p>{{ user.email }}</p>
    </ion-label>
  </ion-item>
</ion-content>
In fact you can right now already use the Google sign in on the web with this implementation – go ahead and give it a try!
google-sign-in-web

Android Google Sign in configuration
Now let’s focus back on the native platforms, and we can start with Android. Again, make sure you have published the OAuth consent screen – in the end this was my actual problem and no log pointed in that direction.

For our app we also need to integrate the plugin correctly, so bring up the android/app/src/main/java/com/devdactic/capalogin/MainActivity.java and change it to:

package com.devdactic.capalogin;

import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    registerPlugin(GoogleAuth.class);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
package com.devdactic.capalogin;
 
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
 
public class MainActivity extends BridgeActivity {
 
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
 
    registerPlugin(GoogleAuth.class);
  }
}
Make sure that you are using your own package in the first line and not mine, I just wanted to show you the whole file content.

No we need to create new credentials within the cloud console again.

We also need a SHA-1 certificate fingerprint, something you usually use when you sign your APK for the Play Store in the end. But in order to hook our app up to Google services, we already need it now.

You can first of all get the fingerprint of your debug key, which is 99% of the time automatically created at ~/.android/debug.keystore on your computer.

Get the output for this key by running:

keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
1
keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
The default password for this key should be android.

If you encounter any problems on a Mac because Java is not installed, head over to the Oracle downloads page and install the current JDK!

From the output of your keytool command copy the value after SHA1, which we gonna use soon.

Now create a new OAuth client ID like we did for the web app before, but this time select the application type Android. Then insert your apps package name and the SHA1 you just copied.
google-sign-in-android-client

Save that information and now I noticed: You don’t need to use the client ID of this entry!

There was an open issue at the time writing which mentioned to use the client id of the web credentials we created before for our app, and that’s what you should put as a new entry into the android/app/src/main/res/values/strings.xml like this:

<string name="server_client_id">xxx-xx.apps.googleusercontent.com</string>
1
<string name="server_client_id">xxx-xx.apps.googleusercontent.com</string>
The funny thing is, you still need to have the other credential hooked up with your SHA1 information, otherwise it didn’t work for me either! So adding the entry wasn’t useless, we just don’t have to use that client key (at least at the time writing this).

Note: If you release your app later, you are using a different key (or maybe even from Play automatic signing) so in that case you also need to supply the SHA1 of that key when publishing your Android app!

Nonetheless, with a bit of trial and error your Google sign in should work on Android now!

iOS Google Sign in configuration
For iOS we can simply create another credential and select the application type iOS this time. Then, add your Bundle ID and you are already done:

google-sign-in-ios-client
You can now download a *.plist file, and you should rename that file to GoogleService-Info.plist first of all.

Now we need to move that file into the right location in our project at ios/App/App so it sits next to the info.plist in your iOS project.

It’s not enough to do this in your text editor, you really need to drag it into Xcode at the right path!

Before copy, also select Copy items if needed and then it should be right in your Xcode project.

Additionally we need to add an URL scheme to our iOS app, and the easiest way is actually inside Xcode again. Keep in mind that all these changes to the native platforms are persistent since we are using Capacitor!

Within Xcode, select your app in the navigation area to the left, go into the Info tab and scroll to the bottom. In here, we need to expand the URL Types area at the bottom and click the plus to create a new scheme.

This scheme will now be filled with the value of your REVERSED_CLIENT_ID, an ID you can find in the previously downloaded GoogleService-Info.plist (not the client ID from before!). Paste that value into the field like in the image below.

xcode-google-sign-in-scheme
This steps makes sure the callback after the Google sign in opens our app correctly.

And with that you are done for iOS as well!

Conclusion
Adding Google sign in to your Capacitor app isn’t too complicated, only the setup of credentials and right information can be challenging.

If your process fails, try to debug the plugin in Android Studio or Xcode to directly see which error messages you get back from Google.

You can also find a video version of this Quick Win below.

[top](#ionic-academy)


# Building an Ionic App with Firebase Authentication & File Upload using AngularFire 7
Posted on February 22nd, 2022


Tweet
Email
WhatsApp
Share
If you want a full blown cloud backend for your Ionic app, Firebase offers everything you need out of the box so you can setup your Ionic app with authentication and file upload in minutes!

In this tutorial we will implement the whole flow from connecting our Ionic app to Firebase, adding user authentication and protecting pages after a login to finally selecting an image with Capacitor and uploading it to Firebase cloud storage!

ionic-firebase-9-auth
All of this might sound intimidating but you will see, it’s actually a breeze with these tools. To handle our Firebase interaction more easily we will use the AngularFire library version 7 which works with the Firebase SDK version 9 which I used in this post.

Note: At the time writing there was a problem when running the app on iOS devices – read until the end for a solution!

Creating the Firebase Project
Before we dive into the Ionic app, we need to make sure we actually have a Firebase app configured. If you already got something in place you can of course skip this step.

Otherwise, make sure you are signed up (it’s free) and then hit Add project inside the Firebase console. Give your new app a name, select a region and then create your project!

Once you have created the project you can see the web configuration which looks like this:

ionic-4-firebase-add-to-app
If it’s a new project, click on the web icon below “Get started by adding Firebase to your app” to start a new web app and give it a name, you will see the configuration in the next step now.

Leave this config block open just for reference, it will hopefully be copied automatically later by a schematic.

Additionally we have to enable the database, so select Firestore Database from the menu and click Create database.

ionic-4-firestore
Here we can set the default security rules for our database and because this is a simple tutorial we’ll roll with the test mode which allows everyone access.

Because we want to work with users we also need to go to the Authetnication tab, click Get started again and activate the Email/Password provider. This allows us to create user with a standard email/ps combination.

firebase-auth-provider
The last step is enabling Storage in the according menu entry as well, and you can go with the default rules because we will make sure users are authenticated at the point when they upload or read files.

The rules should look like this:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
1
2
3
4
5
6
7
8
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
Note: For real applications you need to create secure rules for storage and your Firestore database, otherwise people can easily access all your data from the outside!

You can learn more about Firebase and security rules inside the Ionic Academy.

Starting our Ionic App & Firebase Integration
Now we can finally begin with the actual Ionic app, and all we need is a blank template, an additional page and two services for the logic in our app:

ionic start devdacticFire blank --type=angular
cd ./devdacticFire

ionic g page login
ionic g service services/auth
ionic g service services/avatar

# For image upload with camera
npm i @capacitor/camera
npm i @ionic/pwa-elements

ng add @angular/fire
1
2
3
4
5
6
7
8
9
10
11
12
ionic start devdacticFire blank --type=angular
cd ./devdacticFire
 
ionic g page login
ionic g service services/auth
ionic g service services/avatar
 
# For image upload with camera
npm i @capacitor/camera
npm i @ionic/pwa-elements
 
ng add @angular/fire
Besides that we can already install the Capacitor camera package to capture images later (and the PWA elements for testing on the browser).

To use those PWA elements, quickly bring up your src/main.ts and import plus call the defineCustomElements function:

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

defineCustomElements(window);
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
 
if (environment.production) {
  enableProdMode();
}
 
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
 
defineCustomElements(window);
The last command is the most important as it starts the AngularFire schematic, which has become a lot more powerful over the years! You should select the according functions that your app needs, in our case select Cloud Storage, Authentication and Firestore.

ionic-firebase-add-cli
After that a browser will open to log in with Google, which hopefully reads your list of Firebase apps so you can select the Firebase project and app your created in the beginning!

As a result the schematic will automatically fill your environments/environment.ts file – if bot make sure you manually add the Firebase configuration from the first step like this:

export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
1
2
3
4
5
6
7
8
9
10
11
export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
On top of that the schematic injected everything necessary into our src/app/app.module.ts using the new Firebase 9 modular approach:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
Again, if the schematic failed for some reason that’s how your module should look like before you continue!

Now we can also quickly touch the routing of our app to display the login page as the first page, and use the default home page for the inside area.

We don’t have authentication implemented yet, but we can already use the AngularFire auth guards in two cool ways:

Protect access to “inside” pages by redirecting unauthorized users to the login
Preventing access to the login page for previously authenticated users, so they are automatically forwarded to the “inside” area of the app
This is done with the helping pipes and services of AngularFire that you can now add inside the src/app/app-routing.module.ts:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';
 
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
 
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
Now we can begin with the actual authentication of users!

Building the Authentication Logic
The whole logic will be in a separate service, and we need jsut three functions that simply call the according Firebase function to create a new user, sign in a user or end the current session.

For all these calls you need to add the Auth reference, which we injected inside the constructor.

Since these calls sometimes fail and I wasn’t very happy about the error handling, I wrapped them in try/catch blocks so we have an easier time when we get to our actual page.

Let’s begin with the src/app/services/auth.service.ts now and change it to:

import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}
 
  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }
 
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }
 
  logout() {
    return signOut(this.auth);
  }
}
That’s already everything in terms of logic. Now we need to capture the user information for the registration, and therefore we import the ReactiveFormsModule in our src/app/login/login.module.ts now:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { IonicModule } from '@ionic/angular';
 
import { LoginPageRoutingModule } from './login-routing.module';
 
import { LoginPage } from './login.page';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
Since we want to make it easy, we’ll handle both registration and signup with the same form on one page.

But since we added the whole logic already to a service, there’s not much left for us to do besides showing a casual loading indicator or presenting an alert if the action failed.

If the registration or login is successful and we get back an user object, we immediately route the user forward to our inside area.

Go ahead by changing the src/app/login/login.page.ts to:

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}
 
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
 
  get password() {
    return this.credentials.get('password');
  }
 
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
 
    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();
 
    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }
 
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
 
    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();
 
    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }
 
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
The last missing piece is now our view, which we connect with the formGroup we defined in our page. On top of that we can show some small error messages using the new Ionic 6 error slot.

Just make sure that one button inside the form has the submit type and therefore triggers the ngSubmit action, while the other has the type button if it should just trigger it’s connected click event!

Bring up the src/app/login/login.page.html now and change it to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>My App</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form (ngSubmit)="login()" [formGroup]="credentials">
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-input type="email" placeholder="Email" formControlName="email"></ion-input>
      <ion-note slot="error" *ngIf="(email.dirty || email.touched) && email.errors">Email is invalid</ion-note>
    </ion-item>
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-input type="password" placeholder="Password" formControlName="password"></ion-input>
      <ion-note slot="error" *ngIf="(password.dirty || password.touched) && password.errors">Password needs to be 6 characters</ion-note>
    </ion-item>

    <ion-button type="submit" expand="block" [disabled]="!credentials.valid">Log in</ion-button>
    <ion-button type="button" expand="block" color="secondary" (click)="register()">Create account</ion-button>
  </form>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>My App</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content class="ion-padding">
  <form (ngSubmit)="login()" [formGroup]="credentials">
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-input type="email" placeholder="Email" formControlName="email"></ion-input>
      <ion-note slot="error" *ngIf="(email.dirty || email.touched) && email.errors">Email is invalid</ion-note>
    </ion-item>
    <ion-item fill="solid" class="ion-margin-bottom">
      <ion-input type="password" placeholder="Password" formControlName="password"></ion-input>
      <ion-note slot="error" *ngIf="(password.dirty || password.touched) && password.errors">Password needs to be 6 characters</ion-note>
    </ion-item>
 
    <ion-button type="submit" expand="block" [disabled]="!credentials.valid">Log in</ion-button>
    <ion-button type="button" expand="block" color="secondary" (click)="register()">Create account</ion-button>
  </form>
</ion-content>
And at this point we are already done with the first half of our tutorial, since you can now really register users and also log them in.

You can confirm this by checking the Authentication area of your Firebase console and hopefully a new user was created in there!

ionic-firebase-user
For a more extensive login and registration UI tutorial you can also check out the Ionic App Navigation with Login, Guards & Tabs Area tutorial!

Uploading image files to Firebase with Capacitor
Just like before we will now begin with the service implementation, which makes life really easy for our page later down the road.

The service should first of all return the document of a user in which we plan to store the file reference/link to the user avatar.

In many tutorials you directly create a document inside your Firestore database for a user right after the sign up, but it’s also no problem that we haven’t done by now.

The data can be retrieved using the according docData() function – you can learn more about the way of accessing collections and documents with Firebase 9 here.

Besides that we can craft our uploadImage() function and expect a Photo object since this is what we get back from the Capacitor camera plugin.

Now we just need to create a path to where we want to upload our file and a reference to that path within Firebase storage.

With that information we can trigger the uploadString() function since we simply upload a base64 string this time. But there’s also a function to upload a Blob in case you have some raw data.

When the function is finished, we need to call another getDownloadURL() function to get the actual path of the image that we just uploaded.

This information is now written to the user document so we can later easily retrieve it.

All of that sounds challenging, but it’s actually just a few lines of code inside our src/app/services/avatar.service.ts:

import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
 
@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}
 
  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }
 
  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
 
    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
 
      const imageUrl = await getDownloadURL(storageRef);
 
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        imageUrl,
      });
      return true;
    } catch (e) {
      return null;
    }
  }
}
In the end, we should therefore see an entry inside Firestore with the unique user ID inside the path and the image stored for that user like in the image below.

ionic-firebase-firestore-image
Now let’s put that service to use in our page!

First, we subscribe to the getUserProfile() function as we will then get the new value whenever we change that image.

Besides that we add a logout function, and finally a function that calls the Capacitor camera plugin. The image result will be passed to our service which handles all the rest – we just need some loading and error handling in here again!

Therefore go ahead now and change the src/app/home/home.page.ts to:

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;

  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;
 
  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }
 
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
 
  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });
 
    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();
 
      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();
 
      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
We’re almost there!

Now we need a simple view to display either the user avatar image if it exists, or just a placeholder if we don’t have a user document (or avatar image) yet.

That’s done pretty easily by changing our src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title> My Profile </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <div class="preview">
    <ion-avatar (click)="changeImage()">
      <img *ngIf="profile?.imageUrl; else placheolder_avatar;" [src]="profile.imageUrl" />
      <ng-template #placheolder_avatar>
        <div class="fallback">
          <p>Select avatar</p>
        </div>
      </ng-template>
    </ion-avatar>
  </div>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title> My Profile </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content class="ion-padding">
  <div class="preview">
    <ion-avatar (click)="changeImage()">
      <img *ngIf="profile?.imageUrl; else placheolder_avatar;" [src]="profile.imageUrl" />
      <ng-template #placheolder_avatar>
        <div class="fallback">
          <p>Select avatar</p>
        </div>
      </ng-template>
    </ion-avatar>
  </div>
</ion-content>
To make everything centered and look a bit nicer, just put the following quickly into your src/app/home/home.page.scss:

ion-avatar {
  width: 128px;
  height: 128px;
}

.preview {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.fallback {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: #bfbfbf;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
ion-avatar {
  width: 128px;
  height: 128px;
}
 
.preview {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
 
.fallback {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: #bfbfbf;
 
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
}
And BOOM – you are done and have the whole flow from user registration, login to uploading files as a user implemented with Ionic and Capacitor!

You can check if the image was really uploaded by also taking a look at the Storage tab of your Firebase project.

ionic-firebase-storage-files
If you want the preview to show up correctly in there, just supply the right metadata during the upload task, but the image will be displayed inside your app no matter what.

Native iOS and Android Changes
To make all of this also work nicely on your actual native apps, we need a few changes.

First, go ahead and add those platforms:

ionic build

ionic cap add ios
ionic cap add android
1
2
3
4
ionic build
 
ionic cap add ios
ionic cap add android
Because we are accessing the camera we also need to define the permissions for the native platforms, so let’s start with iOS and add the following permissions (with a good reason in a real app!) to your ios/App/App/Info.plist:

	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To add images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To store images</string>
1
2
3
4
5
6
	<key>NSCameraUsageDescription</key>
	<string>To capture images</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>To add images</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>To store images</string>
For Android we need to do the same. Therefore, bring up the android/app/src/main/AndroidManifest.xml and after the line that already sets the internet permission add two more lines:

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
1
2
3
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
Finally when I ran the app on my device, I just got a white screen of death.

There was a problem with the Firebase SDK and Capacitor, but there’s actually an easy fix.

We only need to change our src/app/app.module.ts and use the native authentication directly from the Firebase SDK when our app runs as a native app:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth();
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth();
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
Because of the modular approach this change is super easy to add, and now you can also enjoy the Firebase app with upload on your iOS device!

Conclusion
Firebase remains one of the best choices as a cloud backend for your Ionic application if you want to quickly add features like user authentication, database or file upload.

For everyone more into SQL, you should also check out the rising star Supabase which offers already all essential functionality that Firebase has in an open source way.

[top](#ionic-academy)
# How to Create an Ionic Side Menu with Accordion Items [v6]
Posted on February 15th, 2022

ionic-side-menu-accordion
Tweet
Email
WhatsApp
Share
The Ionic 6 accordion component is a great and super easy way to build a structured side menu with nested items, simply by using this component!

In this Quick Win we will therefore implement an accordion within a side menu and connect actions to the different items so we can use the entries for navigation.

On top of that we will also build a more advanced version of this menu with dynamic data based on JSON and a custom recursive accordion component!

ionic-side-menu-accordion
If you haven’t used the accordion before, I also recommend you check out our Ionic accordion usage Quick Win!

Ionic App Setup
To begin with we can use the sidemenu template this time, but feel free to simply create a side menu with Ionic real quickly on your own.

Besides that we need one additional details page and for the later part of this tutorial, a module and additional component:

ionic start academyMenu sidemenu --type=angular
cd ./academyMenu

ionic g page details

# Only for recursive accordions!
ionic g module components/sharedComponents --flat
ionic g component components/accordion
1
2
3
4
5
6
7
8
ionic start academyMenu sidemenu --type=angular
cd ./academyMenu
 
ionic g page details
 
# Only for recursive accordions!
ionic g module components/sharedComponents --flat
ionic g component components/accordion
Since we want to load a JSON file into our TS code later, we now also need to add two keys to our tsconfig.json:

  "compilerOptions": {
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
1
2
3
  "compilerOptions": {
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
Finally we change the default routing so we hook up the path with our details page and include a placeholder for the path in there inside our src/app/app-routing.module.ts:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'accordion/Overview',
    pathMatch: 'full',
  },
  {
    path: 'accordion/:path',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'accordion/Overview',
    pathMatch: 'full',
  },
  {
    path: 'accordion/:path',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
Not all of these changes are necessary for a basic static accordion component in the menu, so let’s get started with that easy version.

Simple Ionic Side Menu Accordion
If you just want an accordion with 10-20 static elements then you should be fine with setting this up in a static way.

You can nest the accordion groups, and once you reach a level where you want to really open a page you can include a click handler on those items.
Again, if you are not yet sure about the accordion usage check out the Ionic accordion Quick Win for the basic structure and properties.

In our case we could now change the src/app/app.component.html to include our accordion in the menu like this:

<ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Accordion -->
        <ion-accordion-group>
          <ion-accordion>
            <ion-item slot="header">
              <ion-label>Languages</ion-label>
            </ion-item>
 
            <!-- Content slot -->
            <div slot="content">
              <ion-accordion-group>
 
                <!-- Child accordion -->
                <ion-accordion>
                  <ion-item slot="header">
                    <ion-label>Javascript</ion-label>
                  </ion-item>
 
                  <ion-list slot="content">
                    <ion-item button (click)="open('Languages/Javascript/Angular')">
                      <ion-label>Angular</ion-label>
                    </ion-item>
                    <ion-item button (click)="open('Languages/Javascript/Vue')">
                      <ion-label>Vue</ion-label>
                    </ion-item>
                    <ion-item button (click)="open('Languages/Javascript/React')">
                      <ion-label>React</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-accordion>
 
                <!-- More accordion components if you want!-->

              </ion-accordion-group>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-content>
    </ion-menu>
 
    <!-- Router outlet for main content -->
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
<ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- Accordion -->
        <ion-accordion-group>
          <ion-accordion>
            <ion-item slot="header">
              <ion-label>Languages</ion-label>
            </ion-item>
 
            <!-- Content slot -->
            <div slot="content">
              <ion-accordion-group>
 
                <!-- Child accordion -->
                <ion-accordion>
                  <ion-item slot="header">
                    <ion-label>Javascript</ion-label>
                  </ion-item>
 
                  <ion-list slot="content">
                    <ion-item button (click)="open('Languages/Javascript/Angular')">
                      <ion-label>Angular</ion-label>
                    </ion-item>
                    <ion-item button (click)="open('Languages/Javascript/Vue')">
                      <ion-label>Vue</ion-label>
                    </ion-item>
                    <ion-item button (click)="open('Languages/Javascript/React')">
                      <ion-label>React</ion-label>
                    </ion-item>
                  </ion-list>
                </ion-accordion>
 
                <!-- More accordion components if you want!-->
 
              </ion-accordion-group>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-content>
    </ion-menu>
 
    <!-- Router outlet for main content -->
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>
Now we need to handle that click action correctly to display the details page, which we do with a few steps:

Encode the URI components of the path so Angular doesn’t treat it like a part of the URL
Set the animation direction of the Ionic NavCtrl to have the right page change animation
Route to the actual details page and include the encoded value in the URL
Toggle the menu to close it
Sounds hard, but in fact those are really just four lines inside our src/app/app.component.ts:

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  open(path) {
    const encoded = encodeURIComponent(path);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}
 
  open(path) {
    const encoded = encodeURIComponent(path);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
To make sure you did everything right you can open the src/app/details/details.page.ts now and include the logic to simply load the value from the URL like we always do with Angular routing:

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  path = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const urlPath = this.route.snapshot.paramMap.get('path');
    this.path = urlPath.split('/');
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  path = [];
  constructor(private route: ActivatedRoute) {}
 
  ngOnInit() {
    const urlPath = this.route.snapshot.paramMap.get('path');
    this.path = urlPath.split('/');
  }
}
Finally we can use that information and add a cool breadcrumbs component based on the path, and also add a menu button to our src/app/details/details.page.html:

<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-breadcrumbs>
    <ion-breadcrumb *ngFor="let p of path"> {{ p}} </ion-breadcrumb>
  </ion-breadcrumbs>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-breadcrumbs>
    <ion-breadcrumb *ngFor="let p of path"> {{ p}} </ion-breadcrumb>
  </ion-breadcrumbs>
</ion-content>
Now we got a pretty solid accordion in place, and you could easily fill the different elements or groups, add more accordions inside and just build it our for your data.

Dynamic Accordion View
Maybe you get your menu data from an API, or it’s just really a lot, and you don’t know how many nested accordion levels you will need.

For all those cases you can use a custom component with recursion instead, which actually makes your code a lot shorter in the end (next to all the new files we generate..).

First, we can include the module we generated in the beginning in our src/app/app.module.ts:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './components/shared-components.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './components/shared-components.module';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
We do it here because inside the Ionic sidemenu template this is our first page – normally you would include the components module in the module file of your page where you need it!

Now we also need to declare and export the component in the module file, plus import Ionic components and the Angular router like this inside the src/app/components/shared-components.module.ts:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion/accordion.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AccordionComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [AccordionComponent],
})
export class SharedComponentsModule {}
1
2
3
4
5
6
7
8
9
10
11
12
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion/accordion.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
 
@NgModule({
  declarations: [AccordionComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [AccordionComponent],
})
export class SharedComponentsModule {}
The data for our menu is now a simple structured JSON file, and you can put the following into a new file at src/assets/menu.json:

{
  "items": [
    {
      "name": "Frameworks",
      "children": [
        {
          "name": "Angular",
          "children": [
            {
              "name": "Libraries",
              "children": [
                {
                  "name": "Ionic"
                },
                {
                  "name": "Angular Material"
                }
              ]
            },
            {
              "name": "Links"
            }
          ]
        },
        {
          "name": "React",
          "children": [
            {
              "name": "Libraries",
              "children": [
                {
                  "name": "Ionic"
                },
                {
                  "name": "React Router"
                }
              ]
            }
          ]
        },
        {
          "name": "Vue"
        }
      ]
    },
    {
      "name": "Languages",
      "children": [
        {
          "name": "Javascript",
          "children": [
            {
              "name": "Typescript"
            },
            {
              "name": "Vanilla"
            }
          ]
        },
        {
          "name": "Swift"
        },
        {
          "name": "Swift"
        }
      ]
    }
  ]
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
{
  "items": [
    {
      "name": "Frameworks",
      "children": [
        {
          "name": "Angular",
          "children": [
            {
              "name": "Libraries",
              "children": [
                {
                  "name": "Ionic"
                },
                {
                  "name": "Angular Material"
                }
              ]
            },
            {
              "name": "Links"
            }
          ]
        },
        {
          "name": "React",
          "children": [
            {
              "name": "Libraries",
              "children": [
                {
                  "name": "Ionic"
                },
                {
                  "name": "React Router"
                }
              ]
            }
          ]
        },
        {
          "name": "Vue"
        }
      ]
    },
    {
      "name": "Languages",
      "children": [
        {
          "name": "Javascript",
          "children": [
            {
              "name": "Typescript"
            },
            {
              "name": "Vanilla"
            }
          ]
        },
        {
          "name": "Swift"
        },
        {
          "name": "Swift"
        }
      ]
    }
  ]
}
For the logic of the component we now need two inputs to handle the data of one item, and keep track of the parent(s) of that item so we can route correctly.

This parent will be passed to the component again (we’ll see how in the template), and we can simply add the name to that parent on init.

The function to open an element is almost the same, we just include the parent path as well because one item itself doesn’t have any “history” or knows about its parents without this information.

Therefore bring up the src/app/components/accordion/accordion.component.ts and change it to:

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @Input() item: any;
  @Input() parent = '';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    if (this.parent === '') {
      this.parent = this.item.name;
    } else {
      this.parent += `/${this.item.name}`;
    }
  }

  open(path) {
    const fullPath = `${this.parent}/${path}`;

    const encoded = encodeURIComponent(fullPath);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
 
@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @Input() item: any;
  @Input() parent = '';
 
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}
 
  ngOnInit() {
    if (this.parent === '') {
      this.parent = this.item.name;
    } else {
      this.parent += `/${this.item.name}`;
    }
  }
 
  open(path) {
    const fullPath = `${this.parent}/${path}`;
 
    const encoded = encodeURIComponent(fullPath);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
Now it’s time to get into the actual component template, and we want to have a simple logic in there:

Define a new accordion group
Have a header if the item has more children, otherwise display a fallback template
Include the component itself in the content slot of the accordion for the next level of children!
It’s actually not that hard once you got it figured out, so in code it looks like this inside the src/app/components/accordion/accordion.component.html:

<ion-accordion-group>
  <div *ngFor="let child of item.children">
    <ion-accordion *ngIf="child.children; else row">
      <ion-item slot="header">
        <ion-label>{{ child.name }}</ion-label>
      </ion-item>

      <app-accordion slot="content" *ngIf="child.children" [item]="child" [parent]="parent"></app-accordion>
    </ion-accordion>

    <ng-template #row>
      <ion-item button (click)="open(child.name)"> {{ child.name }} </ion-item>
    </ng-template>
  </div>
</ion-accordion-group>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-accordion-group>
  <div *ngFor="let child of item.children">
    <ion-accordion *ngIf="child.children; else row">
      <ion-item slot="header">
        <ion-label>{{ child.name }}</ion-label>
      </ion-item>
 
      <app-accordion slot="content" *ngIf="child.children" [item]="child" [parent]="parent"></app-accordion>
    </ion-accordion>
 
    <ng-template #row>
      <ion-item button (click)="open(child.name)"> {{ child.name }} </ion-item>
    </ng-template>
  </div>
</ion-accordion-group>
At this point you can also see how we feed the parent path to the component again!

Now we also need to load the JSON information for the dynamic menu, so let’s change our src/app/app.component.ts to:

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import menuData from '../assets/menu.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menu = menuData;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}

  open(path) {
    const encoded = encodeURIComponent(path);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import menuData from '../assets/menu.json';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menu = menuData;
 
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {}
 
  open(path) {
    const encoded = encodeURIComponent(path);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`/accordion/${encoded}`);
    this.menuCtrl.toggle();
  }
}
Finally we can add our new component to the view, and we simply put it into the content slot of one top accordion group – I’m actually pretty sure with a bit of additional logic we could get rid of that element as well and have a completely dynamic accordion tree component instead!

Finish the implementation by changing the src/app/app.component.html to:

<ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-accordion-group>
          <ion-accordion *ngFor="let item of menu.items">
            <ion-item slot="header">
              <ion-label>{{ item.name }}</ion-label>
            </ion-item>

            <app-accordion [item]="item" slot="content"></app-accordion>
          </ion-accordion>
        </ion-accordion-group>
      </ion-content>
    </ion-menu>

    <!-- Router outlet for main content -->
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
<ion-app>
  <ion-split-pane contentId="main-content">
    <ion-menu contentId="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-accordion-group>
          <ion-accordion *ngFor="let item of menu.items">
            <ion-item slot="header">
              <ion-label>{{ item.name }}</ion-label>
            </ion-item>
 
            <app-accordion [item]="item" slot="content"></app-accordion>
          </ion-accordion>
        </ion-accordion-group>
      </ion-content>
    </ion-menu>
 
    <!-- Router outlet for main content -->
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-split-pane>
</ion-app>
And that’s it – go ahead and change the JSON file how you want and the menu will reflect your changes!

Styling the Accordion
If you also want to get started with custom styling, here’s a starting point that would add CSS to expanded or collapsed accordions.

Simply add the following to your src/global.scss:

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  --background: #0c0254;
  --color: #fff;
  font-weight: 600;
  ion-icon {
    color: #fff;
  }
  border-bottom: 2px solid #fff;
}

ion-accordion.accordion-collapsed ion-item[slot="header"],
ion-accordion.accordion-collapsing ion-item[slot="header"] {
  --background: var(--ion-color-primary);
  --color: #fff;
  font-weight: 600;
  ion-icon {
    color: #fff;
  }
  border-bottom: 2px solid #fff;
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  --background: #0c0254;
  --color: #fff;
  font-weight: 600;
  ion-icon {
    color: #fff;
  }
  border-bottom: 2px solid #fff;
}
 
ion-accordion.accordion-collapsed ion-item[slot="header"],
ion-accordion.accordion-collapsing ion-item[slot="header"] {
  --background: var(--ion-color-primary);
  --color: #fff;
  font-weight: 600;
  ion-icon {
    color: #fff;
  }
  border-bottom: 2px solid #fff;
}
You could now also decrease the height of open accordions, but working on that will be a bit more challenging. Perhaps use some padding to indicate the offset of levels?

Conclusion
It’s not that hard to build either a static or dynamic side menu with accordion components and routing.

We have used just one path, but you could easily define all paths that you have as well and use the according routerLink URLs on the component as well, or include an icon inside the dynamic JSON for the menu.

Tons of options – let me know if you encounter any problems of course!

You can also find a video version of this Quick Win below.
[top](#ionic-academy)

# How to use the Ionic 6 Accordion Component [v6]
Posted on January 4th, 2022

ionic-6-accordion
Tweet
Email
WhatsApp
Share
The new Ionic 6 accordion is a great component in many ways to display nested content on pages or even as sort of dropdown inside a menu.

In this Quick Win we will explore the Ionic 6 accordion component, how to use it in the easiest possible way and also as a nested list.

ionic-accordion
On top of that we will inject custom styling and style the different parts of the accordion so we can make it ours in every scenario!

Ionic App Setup
To use the component you can bring up a new app for testing or use your own application – just make sure you have at least @ionic/angular version 6 in your app:

ionic start accordionApp blank --type=angular
cd ./accordionApp
npm i @ionic/angular/latest
1
2
3
ionic start accordionApp blank --type=angular
cd ./accordionApp
npm i @ionic/angular/latest
The accordion is included with Ionic so you don’t need any additional package.

Basic Ionic Accordion Usage
To use the accordion you need a very simple setup with a parent ion-accordion-group and how many ion-accordion elements you want inside.

For every ion-accordion you then need to define the content for two slots:

header: This is the value (most of the time an item) that you see when the accordion is collapsed
content: This is the content which is revealed once you toggle the accordion
The easiest way of using the component is by putting items into those slots as their size works nicely within the Ionic accordion.

Go ahead and change the src/app/home/home.page.html for a basic implementation:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Accordion </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-accordion-group>
    <ion-accordion>
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>

      <ion-list slot="content">
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Java</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
<ion-header>
  <ion-toolbar color="primary">
    <ion-title> Ionic Accordion </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-accordion-group>
    <ion-accordion>
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>
 
      <ion-list slot="content">
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Java</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
And with that you have a pretty cool, functional accordion component without using any other model or styling!

Styling the Accordion
However, in most cases you want some custom styling, be it just for the colors or margins.

There are different ways to style the accordion by targeting either the parts() or the slots.

If you target the parts (content or header), you can define general styling for those elements. Let’s for example add some background color and padding by changing the src/app/home/home.page.scss:

ion-accordion::part(content) {
  padding: 10px;
  background: #bdbdbd;
}

ion-accordion::part(header) {
  padding: 10px;
  background: #dcdcdc;
}
1
2
3
4
5
6
7
8
9
ion-accordion::part(content) {
  padding: 10px;
  background: #bdbdbd;
}
 
ion-accordion::part(header) {
  padding: 10px;
  background: #dcdcdc;
}
The problem is, this doesn’t apply to the actual item inside the slot and only to the div element that represents the slot itself.

If you want to inject styling into the items of our previous example we need to target them right inside the slots.

Additionally we can add classes to target the state while the accordion opens and is open, or while it’s collapsing:

accordion-expanding and accordion-expanded for the open state
accordion-collapsed and accordion-collapsing for the closing state
Now let’s take a look at how this transfers to real CS rules by adding colors to both the header and content slot:

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  --background: var(--ion-color-secondary);
  --color: #fff;
}

ion-accordion.accordion-expanding [slot="content"],
ion-accordion.accordion-expanded [slot="content"] {
  --ion-item-background: #0c0254;
  --ion-item-color: #fff;
}

// Also possible:
// ion-accordion.accordion-collapsed
// ion-accordion.accordion-collapsing
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  --background: var(--ion-color-secondary);
  --color: #fff;
}
 
ion-accordion.accordion-expanding [slot="content"],
ion-accordion.accordion-expanded [slot="content"] {
  --ion-item-background: #0c0254;
  --ion-item-color: #fff;
}
 
// Also possible:
// ion-accordion.accordion-collapsed
// ion-accordion.accordion-collapsing
This now gives more granular control over the accordion component so you can target the other Ionic component that you put into the respective slots.

Control Accordion from Code
Just like other components the Ionic accordion can be controlled from code. Although the functionality feels a bit quirky as we need to set a value and not just call a function, it works as epected.

Let’s change our HTML to include two buttons to toggle and collapse the accordion, and on top of that we define the value of the ion-accordion which acts like an identifier for this accordion:

<ion-content>
  <ion-button (click)="closeAccordion()" expand="full">Close accordion</ion-button>
  <ion-button (click)="toggleSection()" expand="full">Toggle Section</ion-button>

  <ion-accordion-group>
    <ion-accordion value="languages">
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>

      <ion-list slot="content">
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Go</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
<ion-content>
  <ion-button (click)="closeAccordion()" expand="full">Close accordion</ion-button>
  <ion-button (click)="toggleSection()" expand="full">Toggle Section</ion-button>
 
  <ion-accordion-group>
    <ion-accordion value="languages">
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>
 
      <ion-list slot="content">
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Go</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
Now we can include the IonAccordionGroup as a ViewChild in our code, and set the value of the parent accordion group either to an empty string to close all child accordions, or to the specific value of one accordion like in our case the value “languages”:

import { Component, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  selection = '';

  constructor() {}

  closeAccordion() {
    this.accordionGroup.value = '';
  }

  toggleSection() {
    this.accordionGroup.value = 'languages';
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
import { Component, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  selection = '';
 
  constructor() {}
 
  closeAccordion() {
    this.accordionGroup.value = '';
  }
 
  toggleSection() {
    this.accordionGroup.value = 'languages';
  }
}
This can be helpful if you want to initially open the accordion or do it after a little timeout when the page opens, which always looks nice and interactive to a user!

More Accordion Settings
Besides everything we’ve seen so far there are a few more properties worth mentioning:

expand: Describes the UI of the accordion, which is set to compact by default and inset renders the accordion within a card
multiple: Allow the user to open multiple accordions of one group at the same time
toggleIcon and toggleIconSlot: Change the icon and the position of the icon for the accordion group
Let’s see this in action again with different child accordions:

<ion-content>
  <ion-accordion-group expand="inset" multiple="true">
    <ion-accordion toggleIcon="arrow-down" toggleIconSlot="start">
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>

      <ion-list slot="content">
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Go</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>

    <ion-accordion toggleIcon="chevron-down" toggleIconSlot="start">
      <ion-item slot="header">
        <ion-label>Frameworks</ion-label>
      </ion-item>

      <ion-list slot="content">
        <ion-item>
          <ion-label>Angular</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>React</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Vue</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
<ion-content>
  <ion-accordion-group expand="inset" multiple="true">
    <ion-accordion toggleIcon="arrow-down" toggleIconSlot="start">
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>
 
      <ion-list slot="content">
        <ion-item>
          <ion-label>Swift</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Javascript</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Go</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
 
    <ion-accordion toggleIcon="chevron-down" toggleIconSlot="start">
      <ion-item slot="header">
        <ion-label>Frameworks</ion-label>
      </ion-item>
 
      <ion-list slot="content">
        <ion-item>
          <ion-label>Angular</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>React</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Vue</ion-label>
        </ion-item>
      </ion-list>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
Nothing fancy, but it’s nice to have these settings and easily change the UI for different use cases!

Nesting Accordions
Finally it’s also possible to nest multiple accordions so you could create a view like a file explorer or menu with multiple levels – let me now if you are interested in another tutorial about that!

To achieve this UI the only thing we need to do is throw in another (and another, and another..) accordion group into the content slot of our first accordion:

<ion-content>
  <ion-accordion-group>
    <ion-accordion>
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>

      <div slot="content">
        <ion-accordion-group expand="inset">
          <ion-accordion toggleIcon="arrow-down">
            <ion-item slot="header">
              <ion-label>Javascript</ion-label>
            </ion-item>

            <ion-list slot="content">
              <ion-item>
                <ion-label>Angular</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Vue</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>React</ion-label>
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>

        <ion-accordion-group expand="inset">
          <ion-accordion toggleIcon="arrow-down">
            <ion-item slot="header">
              <ion-label>Swift</ion-label>
            </ion-item>

            <ion-list slot="content">
              <ion-item>
                <ion-label>UI</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Server</ion-label>
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
<ion-content>
  <ion-accordion-group>
    <ion-accordion>
      <ion-item slot="header">
        <ion-label>Languages</ion-label>
      </ion-item>
 
      <div slot="content">
        <ion-accordion-group expand="inset">
          <ion-accordion toggleIcon="arrow-down">
            <ion-item slot="header">
              <ion-label>Javascript</ion-label>
            </ion-item>
 
            <ion-list slot="content">
              <ion-item>
                <ion-label>Angular</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Vue</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>React</ion-label>
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
 
        <ion-accordion-group expand="inset">
          <ion-accordion toggleIcon="arrow-down">
            <ion-item slot="header">
              <ion-label>Swift</ion-label>
            </ion-item>
 
            <ion-list slot="content">
              <ion-item>
                <ion-label>UI</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Server</ion-label>
              </ion-item>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </ion-accordion>
  </ion-accordion-group>
</ion-content>
Make sure you are using different values for the accordions now as otherwise you might see some accordions open even though you didn’t click on them at all.

Conclusion
The Ionic 6 component is a great new component that’s super easy to use and which comes with great functionality like revealing animation and icon change animation right out of the box.

You can use it in many cases and while it only comes with simple basic styling, you can easily customize all elements by targeting the parts and slots of the component.

You can also find a video version of this Quick Win below.

[top](#ionic-academy)
<!-- # anchor -->
# How to use the Ionic 6 Datetime component [v6]
Posted on December 21st, 2021


Tweet
Email
WhatsApp
Share
The Ionic 6 datetime component comes with a lot of updates, and the potential to create epic date selections inside your Ionic app.

In this Quick Win we will check out the basic usage of the updated ion-datetime component and understand how it works in combination with the ISO date format.
ionic-6-datetime-component

On top of that we will integrate an inline modal in which we display the datetime component for an epic visual presentation!

Getting Started
We only need a blank app for testing and the date-fns package which will help with some date formatting:

ionic start academyDate blank --type=angular
cd ./academyDate

npm i date-fns
1
2
3
4
ionic start academyDate blank --type=angular
cd ./academyDate
 
npm i date-fns
This lightweight library is recommended by Ionic and does a great job for everything related to date formatting!

Datetime Presentation Modes
First of all let’s check out some basics. We begin with the different presentation modes that are possible with the datetime component.

For this we create an array of modes so we can switch through them to quickly get a feeling. Open up the src/app/home/home.page.ts and change it to:

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  modes = ['date', 'date-time', 'month', 'month-year', 'time', 'time-date', 'year'];
  selectedMode = 'date';

  constructor() {}

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
import { Component } from '@angular/core';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  modes = ['date', 'date-time', 'month', 'month-year', 'time', 'time-date', 'year'];
  selectedMode = 'date';
 
  constructor() {}
 
}
Now we can create a segment control with buttons for every mode, and pass the selectedMode to the presentation property of the datetime without any other settings.

Go ahead and change the src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Datetime
    </ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-segment [(ngModel)]="selectedMode" scrollable>
      <ion-segment-button [value]="mode" *ngFor="let mode of modes">
        <ion-label>{{ mode }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-card>
    <ion-datetime [presentation]="selectedMode"></ion-datetime>
  </ion-card>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Datetime
    </ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-segment [(ngModel)]="selectedMode" scrollable>
      <ion-segment-button [value]="mode" *ngFor="let mode of modes">
        <ion-label>{{ mode }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-card>
    <ion-datetime [presentation]="selectedMode"></ion-datetime>
  </ion-card>
 
</ion-content>
Now you should be able to play around with the different modes to see your options:

date, date-time, time, time-date: These are a combination of a calendar view with a time selection, either before or after the calendar view
month, month-year, year: A picker like representation for each of the selected columns
Since this is not really helpful by itself, let’s see a more realistic usage with values.

Datetime Value Parsing
The datetime component will output an ISO 8601 datetime format, and that’s also what we should feed into it when setting the current day or in general the preselected value.

To achieve this we can use the format() function of the date-fns library we installed before.

Since this dateValue is not really something you want to show your users, we also format this value into a more readable string when we set the initial day and whenever our dateChanged() function is called.

To get started, bring up the src/app/home/home.page.ts again and change it to:

import { Component } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'
  formattedString = '';
  modes = ['date', 'date-time', 'month', 'month-year', 'time', 'time-date', 'year'];
  selectedMode = 'date';
  showPicker = false;

  constructor() {
    this.setToday();
  }

  setToday() {
    this.formattedString = format(parseISO(format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'), 'HH:mm, MMM d, yyyy');
  }

  async dateChanged(value) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'HH:mm, MMM d, yyyy');
    this.showPicker = false;
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
import { Component } from '@angular/core';
import { format, parseISO } from 'date-fns';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'
  formattedString = '';
  modes = ['date', 'date-time', 'month', 'month-year', 'time', 'time-date', 'year'];
  selectedMode = 'date';
  showPicker = false;
 
  constructor() {
    this.setToday();
  }
 
  setToday() {
    this.formattedString = format(parseISO(format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'), 'HH:mm, MMM d, yyyy');
  }
 
  async dateChanged(value) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'HH:mm, MMM d, yyyy');
    this.showPicker = false;
  }
}
Now we can build a more complex component, and since I guess that you don’t want to show the full component inside a form all the time, we use the showPicker value to only show it when clicking the inout field which holds the readable date format for the user.

Let’s take a look at everything we added to the component:

We set the size to cover so it’s using the full width
We pass in the raw ISO date value
We handle change and cancel events of the component, which will be triggered when we click certain buttons
We enable the default cancel/confirm buttons with showDefaultButtons, which will trigger the pervasively mentioned events
So we bring up the src/app/home/home.page.html again and create a new element in our content area like this:

<ion-content>

  <ion-item (click)="showPicker = !showPicker;">
    <ion-label>Date
      <p>Click me!</p>
    </ion-label>
    <ion-text slot="end">{{ formattedString }}</ion-text>
  </ion-item>
  <ion-datetime *ngIf="showPicker" #datetime 
    [value]="dateValue" 
    size="cover"
    (ionChange)="dateChanged(datetime.value)" 
    (ionCancel)="showPicker = false;" 
    showDefaultButtons="true"></ion-datetime>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
<ion-content>
 
  <ion-item (click)="showPicker = !showPicker;">
    <ion-label>Date
      <p>Click me!</p>
    </ion-label>
    <ion-text slot="end">{{ formattedString }}</ion-text>
  </ion-item>
  <ion-datetime *ngIf="showPicker" #datetime 
    [value]="dateValue" 
    size="cover"
    (ionChange)="dateChanged(datetime.value)" 
    (ionCancel)="showPicker = false;" 
    showDefaultButtons="true"></ion-datetime>
 
</ion-content>
We could also use ngModel on this component, however I encountered some strange bugs with duplicate events that I turned to the solution of using a template reference and then accessing the value of it that get’s passed to our change function instead!

This conditional presentation is already quite nice, but we can take things a step further.

Datetime in Overlay
I feel like this component really shines within a slightly transparent overlay – and that’s what we do now.

And there’s another cool thing: We can use a trigger and add an inline modal so we don’t even have to handle another page!

The modal is triggered by a button or element which has the same id, in our case we add it to an ion-item.

Besides that the datetime components uses mostly the same logic like before, but instead of the default buttons we want to use our own buttons (for whatever reason).

To achieve this, we can use the buttons slot of the datetime component and add our own buttons and functions that will handle the confirm/dismiss later.

For now, we can again change the src/app/home/home.page.html and ad dour inline modal:

<ion-content>

  <ion-item id="open-modal">
    <ion-icon icon="calendar-outline" slot="start" color="primary"></ion-icon>
    <ion-label>Pick date
    </ion-label>
    <ion-text slot="end">{{ formattedString }}</ion-text>
  </ion-item>

  <ion-modal trigger="open-modal">
    <ng-template>
      <ion-content scrollY="false">
        <ion-datetime #datetimemodal [value]="dateValue" size="cover"
          (ionChange)="modalDateChanged(datetimemodal.value)">
          <ion-buttons slot="buttons">
            <ion-button (click)="close()">Dismiss</ion-button>
            <ion-button (click)="select()" color="primary">Select</ion-button>
          </ion-buttons>
        </ion-datetime>
      </ion-content>
    </ng-template>
  </ion-modal>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
<ion-content>
 
  <ion-item id="open-modal">
    <ion-icon icon="calendar-outline" slot="start" color="primary"></ion-icon>
    <ion-label>Pick date
    </ion-label>
    <ion-text slot="end">{{ formattedString }}</ion-text>
  </ion-item>
 
  <ion-modal trigger="open-modal">
    <ng-template>
      <ion-content scrollY="false">
        <ion-datetime #datetimemodal [value]="dateValue" size="cover"
          (ionChange)="modalDateChanged(datetimemodal.value)">
          <ion-buttons slot="buttons">
            <ion-button (click)="close()">Dismiss</ion-button>
            <ion-button (click)="select()" color="primary">Select</ion-button>
          </ion-buttons>
        </ion-datetime>
      </ion-content>
    </ng-template>
  </ion-modal>
 
</ion-content>
Since we are using our own buttons we need to interact with the component directly and either confirm() or cancel() the selected value, which will trigger the events of the component.

To do so, we add the IonDatetime as a viewchild and call the according functions to handle the click of our buttons inside the src/app/home/home.page.ts:

  @ViewChild(IonDatetime) datetime: IonDatetime;

  modalDateChanged(value) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }

  async close() {
    await this.datetime.cancel(true);
  }

  async select() {
    await this.datetime.confirm(true);
  }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
  @ViewChild(IonDatetime) datetime: IonDatetime;
 
  modalDateChanged(value) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }
 
  async close() {
    await this.datetime.cancel(true);
  }
 
  async select() {
    await this.datetime.confirm(true);
  }
Now we got a working modal, but it’s not really looking good yet.

Don’t worry, we can fix this easily by applying some custom styling inside the src/global.scss that targets our modal:

ion-modal {
  --background: rgba(44, 39, 45, 0.2);

  &::part(content) {
    backdrop-filter: blur(6px);
  }

  ion-content {
    --padding-top: 25vh;
    --padding-start: 20px;
    --padding-end: 20px;
    --background: transparent;

    ion-datetime {
        border-radius: 8px;
    }
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
ion-modal {
  --background: rgba(44, 39, 45, 0.2);
 
  &::part(content) {
    backdrop-filter: blur(6px);
  }
 
  ion-content {
    --padding-top: 25vh;
    --padding-start: 20px;
    --padding-end: 20px;
    --background: transparent;
 
    ion-datetime {
        border-radius: 8px;
    }
  }
}
Note: This would change the styling of all your modals – probably add a specific class or ID to your date modal to only use our blurred transparent background for that!

As a result, you got an epic input for date values, and you can still fine tune which presentation mode you would like to use.

Conclusion
The Ionic 6 datetime component looks great out of the box but might require some additional code to integrate it seamless into your app.

But even on the web, this input will work a lot better than previous UIs.

Besides that I recommend to either create a custom enter animation for the modal or use the md mode for the modal, which fades in the modal instead of bringing it up from the bottom.

You can also find a video version of this Quick Win below.
[top](#ionic-academy)
<!-- # anchor -->
# Ionic Image Zoom with Swiper [v6]
Posted on November 23rd, 2021

If you want to zoom into images with Ionic, you first had access to a scroll component and then slides, but with the deprecation of Ionic slides in the future we need a new way to zoom our images.

Glad we can once again turn to Swiper as we did as a replacement for ion-slides already to implement a cool zoom functionality.

ionic-image-zoom-swiper
We can even control this from code and we’ll show our images in a nice modal with blurred background as a little bonus today!


Creating the Ionic Image Zoom App
We get started with a blank Ionic app and install Swiper, the only package we need today. On top of that we can already generate the modal where we want to display our images in:

ionic start acadeymZoom blank --type=angular --capacitor
cd ./acadeymZoom

# Install Swiper
npm i swiper

# Generate a page for the modal
ionic g page imageModal
1
2
3
4
5
6
7
8
ionic start acadeymZoom blank --type=angular --capacitor
cd ./acadeymZoom
 
# Install Swiper
npm i swiper
 
# Generate a page for the modal
ionic g page imageModal
To use the Swiper we need to import the module in the page where we need it, so inside our blank new app we can open the src/app/home/home.module.ts and import it like:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
 
import { SwiperModule } from 'swiper/angular';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
On top of that we need to import some styling, which we can do quite easy in the src/global.scss:

@import 'swiper/css/bundle';
1
@import 'swiper/css/bundle';
That’s all we need for now to include Swiper, so let’s begin with a little image gallery.

Creating an Image Gallery
For this app I’ve added four images named 1.png, 2…. to the assets folder of our project, so we can now simply iterate them to create a gallery of slides inside our src/app/home/home.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Swiper
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <swiper [config]="config">
    <ng-template swiperSlide *ngFor="let img of [1, 2, 3, 4]">
      <img src="assets/{{ img }}.png" tappable (click)="openPreview(img)">
    </ng-template>
  </swiper>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Swiper
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <swiper [config]="config">
    <ng-template swiperSlide *ngFor="let img of [1, 2, 3, 4]">
      <img src="assets/{{ img }}.png" tappable (click)="openPreview(img)">
    </ng-template>
  </swiper>
</ion-content>
With a click on one of the images we want to open a bigger preview in which we will be able to zoom the image in a special container, a bit like a lightbox.

To make the gallery more appealing, let’s throw in some CSS into our src/app/home/home.page.scss:

swiper {
  margin-top: 20%;
  background: #e6e6e6;
 
  img {
      padding-top: 20px;
      padding-bottom: 20px;
  }
}
1
2
3
4
5
6
7
8
9
swiper {
  margin-top: 20%;
  background: #e6e6e6;
 
  img {
      padding-top: 20px;
      padding-bottom: 20px;
  }
}
On top of that we’ve already defined a config on the Swiper component, so now we need to create that component to show multiple images per view with a bit of space between.

Besides that we can implement the function to open our image modal, which adds the custom CSS class transparent-modal to the modal and also passes the selected image as componentProps to that modal.

Go ahead and change the src/app/home/home.page.ts to:

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  config: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };

  constructor(private modalCtrl: ModalController) {}

  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });
    modal.present();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { ImageModalPage } from '../image-modal/image-modal.page';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  config: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };
 
  constructor(private modalCtrl: ModalController) {}
 
  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });
    modal.present();
  }
}
To achieve our blurred transparent modal effect we need to implement the class at the root level in our src/global.scss like this:

.transparent-modal {
    --background: rgba(44, 39, 45, 0.2);
    
    &::part(content) {
        backdrop-filter: blur(12px);
      }
}
1
2
3
4
5
6
7
.transparent-modal {
    --background: rgba(44, 39, 45, 0.2);
    
    &::part(content) {
        backdrop-filter: blur(12px);
      }
}
We’re also targeting the specific content part of the modal to apply our blur filter, a specific CSS function which I explain more (amon a lot of other cool stuff) inside the Built with Ionic eBook!

Creating the Ionic Image Zoom Modal
Since we want to use Swiper again and we are now inside a different page, we need to import the module again just like before. Therefore bring up the src/app/image-modal/image-modal.module.ts and insert:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageModalPageRoutingModule } from './image-modal-routing.module';

import { ImageModalPage } from './image-modal.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageModalPageRoutingModule,
    SwiperModule
  ],
  declarations: [ImageModalPage]
})
export class ImageModalPageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { IonicModule } from '@ionic/angular';
 
import { ImageModalPageRoutingModule } from './image-modal-routing.module';
 
import { ImageModalPage } from './image-modal.page';
 
import { SwiperModule } from 'swiper/angular';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageModalPageRoutingModule,
    SwiperModule
  ],
  declarations: [ImageModalPage]
})
export class ImageModalPageModule {}
Now on to the modal template itself.

The secret to making something zoomable inside your view is wrapping it inside a div element with the class swiper-zoom-container – that’s mostly all you have to do!

But if you want to access the zoom from code as well, we need to give our swiper component a template reference and we’ll throw in some buttons to trigger that actions.

Open up the src/app/image-modal/image-modal.page.html and change it to this now:

<ion-content>
  <swiper #swiper [config]="config">
    <ng-template swiperSlide>
      <div class="swiper-zoom-container">
        <img src="assets/{{ img }}.png">
      </div>
    </ng-template>
  </swiper>

</ion-content>

<ion-footer>
  <ion-row>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="zoom(false)" fill="clear" color="light">
        <ion-icon name="remove" slot="start"></ion-icon>
        out
      </ion-button>
    </ion-col>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="close()" fill="clear" color="light">
        <ion-icon name="close" slot="start"></ion-icon>
        close
      </ion-button>
    </ion-col>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="zoom(true)" fill="clear" color="light">
        <ion-icon name="add" slot="start"></ion-icon>
        in
      </ion-button>
    </ion-col>
  </ion-row>
</ion-footer>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
<ion-content>
  <swiper #swiper [config]="config">
    <ng-template swiperSlide>
      <div class="swiper-zoom-container">
        <img src="assets/{{ img }}.png">
      </div>
    </ng-template>
  </swiper>
 
</ion-content>
 
<ion-footer>
  <ion-row>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="zoom(false)" fill="clear" color="light">
        <ion-icon name="remove" slot="start"></ion-icon>
        out
      </ion-button>
    </ion-col>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="close()" fill="clear" color="light">
        <ion-icon name="close" slot="start"></ion-icon>
        close
      </ion-button>
    </ion-col>
    <ion-col size="4" class="ion-text-center">
      <ion-button (click)="zoom(true)" fill="clear" color="light">
        <ion-icon name="add" slot="start"></ion-icon>
        in
      </ion-button>
    </ion-col>
  </ion-row>
</ion-footer>
As a quick sidestep we should add a bit of CSS to make the slide appear in the center and the background transparent so our blurred modal works best.

We can do this right inside the src/app/image-modal/image-modal.page.scss now:

ion-content {
    --background: transparent;
}
 
ion-footer {
    margin-bottom: 10px;
}
 
swiper {
    height: 100%;
}
1
2
3
4
5
6
7
8
9
10
11
ion-content {
    --background: transparent;
}
 
ion-footer {
    margin-bottom: 10px;
}
 
swiper {
    height: 100%;
}
The last missing piece is now the Swiper configuration, because we need to enable the zoom module for the component!

I’m using the “old” Swiper v6 way with use() in here since it’s not deprecated and the new approach didn’t yet work for me.

On top of that we can configure the zoom behaviour of our app based on the Swiper API for zooming, which could be as easy as setting the value to true or otherwise more granular control about the zoom behaviour.

To access the zoom functionality we can use our ViewChild and get the swiperRef from it.

With this object you could basically call all the functions of Swiper, and by accessing the zoom property we can finally zoom in and out from code!

Wrap up our example by changing the src/app/image-modal/image-modal.page.ts to:

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import SwiperCore, { Zoom } from 'swiper';
SwiperCore.use([Zoom]);

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @Input()img: any;
  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    zoom: {
      maxRatio: 5
    }
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async zoom(zoomIn: boolean) {    
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
 
import SwiperCore, { Zoom } from 'swiper';
SwiperCore.use([Zoom]);
 
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @Input()img: any;
  @ViewChild('swiper') swiper: SwiperComponent;
 
  config: SwiperOptions = {
    zoom: {
      maxRatio: 5
    }
  };
 
  constructor(private modalCtrl: ModalController) { }
 
  ngOnInit() {}
 
  async zoom(zoomIn: boolean) {    
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }
 
  close() {
    this.modalCtrl.dismiss();
  }
}
The zoom works best on a device, but even on a desktop computer you can use the double click gesture to zoom in and out of the image inside our stylish lightbox!

Conclusion
Implementing an image zoom functionality isn’t hard, it’s sometimes simply challenging to get the markup and boundaries correct if e.g. your image lives inside a card.

Let me know if you want to see another way of using zoom in your Ionic app!

You can also find a video version of this Quick Win below.
[top](#ionic-academy)

# Build Your First Ionic App with Firebase using AngularFire 7
Posted on November 2nd, 2021

ionic-firebase-angularfire-7
Tweet
Email
WhatsApp
Share
Using Firebase as the backend for your Ionic apps is a great choice if you want to build a robust system with live data fast, and by using AngularFire you can use a simple wrapper around the official Firebase JS SDK.

In this tutorial we will use the currently latest version 7 of AngularFire which uses the Firebase JS SDK version 9.

We will build a simple note taking app and include all essential Firebase CRUD functions!

ionic-firebase-angularfire
User authentication, file upload, security rules and more topics are covered in the courses of the Ionic Academy!

Creating the Firebase Project
Before we dive into the Ionic app, we need to make sure we actually have a Firebase app configured. If you already got something in place you can of course skip this step.

Otherwise, make sure you are signed up (it’s free) and then hit Add project inside the Firebase console. Give your new app a name, select a region and then create your project!

Once you have created the project you need to find the web configuration which looks like this:

ionic-4-firebase-add-to-app
If it’s a new project, click on the web icon below “Get started by adding Firebase to your app” to start a new web app and give it a name, you will see the configuration in the next step now.

Leave this config block open (or copy it already) until our app is ready so we can insert it in our environment!

Additionally we have to enable the database, so select Firestore Database from the menu and click Create database.

ionic-4-firestore
Here we can set the default security rules for our database and because this is a simple tutorial we’ll roll with the test mode which allows everyone access.

Starting our Ionic App & Firebase Integration
Now we are ready to setup the Ionic app, so generate a new app with an additional page and service for our logic and then use the AngularFire schematic to add all required packages and changes to the project:

ionic start devdacticFire blank --type=angular --capacitor
cd ./devdacticFire

# Generate a page and service
ionic g page modal
ionic g service services/data

# Install Firebase and AngularFire
ng add @angular/fire
1
2
3
4
5
6
7
8
9
ionic start devdacticFire blank --type=angular --capacitor
cd ./devdacticFire
 
# Generate a page and service
ionic g page modal
ionic g service services/data
 
# Install Firebase and AngularFire
ng add @angular/fire
Now we need the configuration from Firebase that you hopefully kept open in your browser, and we can add it right inside our environments/environment.ts like this:

export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
1
2
3
4
5
6
7
8
9
10
11
export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
Finally we set up the connection to Firebase by passing in our configuration. This looks different from previous versions as we are now using factory functions to setup all services that we need, like in our example the getFirestore().

Go ahead and change the src/app/app.module.ts to:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
 
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
Injecting more services like authentication or file storage basically follow the same setup!

Working with Firestore Docs & Collections
As a first step we will create a service that interacts with Firebase and loads our data. It’s always a good idea to outsource your logic into a service!

To work with Firestore in the latest version we need to inject the Firestore instance into every call, so we import it within our constructor and later use it in our CRUD functions. On top of that we simply create a reference to the path in our Firestore database to either a collection or document.

Let’s go through each of them:

getNotes: Access the notes collection and query the data using collectionData()
getNoteById: Access one document in the notes collection and return the data with docData()
addNote: With a reference to the notes collection we use addDoc() to simply push a new document to a collection where a unique ID is generated for it
deleteNote: Delete a document at a specific path using deleteDoc()
updateNote: Create a reference to one document and update it through updateDoc()
For our first functions we also pass in an options object that contains idField, which helps to easily include the ID of a document in the response!

Now let’s go ahead and change the src/app/services/data.service.ts to:

import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Note {
  id?: string;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  getNotes(): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, { idField: 'id'}) as Observable<Note[]>;
  }

  getNoteById(id): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }

  addNote(note: Note) {
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }

  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }

  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { title: note.title, text: note.text });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
 
export interface Note {
  id?: string;
  title: string;
  text: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  constructor(private firestore: Firestore) { }
 
  getNotes(): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, { idField: 'id'}) as Observable<Note[]>;
  }
 
  getNoteById(id): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }
 
  addNote(note: Note) {
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }
 
  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }
 
  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { title: note.title, text: note.text });
  }
}
With all of that in place we are ready to build some functionality on top of our service.

Load and add to Firestore Collections
First of all we want to display a list with the collection data, so let’s create a quick template first. We add a click event to every item, and additionally use a FAB button to create new notes for our collection.

Get started by changing the src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Notes
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-list>
    <ion-item *ngFor="let note of notes" (click)="openNote(note)">
      <ion-label>
        {{ note.title }}
      </ion-label>
    </ion-item>
  </ion-list>

  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button (click)="addNote()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Notes
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-list>
    <ion-item *ngFor="let note of notes" (click)="openNote(note)">
      <ion-label>
        {{ note.title }}
      </ion-label>
    </ion-item>
  </ion-list>
 
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button (click)="addNote()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  
</ion-content>
Since we have created the logic to load the data before, we now simply load the data from our service and assign it to our local notes array.

To add a new note we can use the Ionic alert controller and two simple inputs to capture a title and text for a new note.

With that information we can call addNote() from our service to create a new note in our Firestore collection.

We don’t need any additional logic to reload the collection data – since we are subscribed to an Observable that returns our collection data we will automatically receive the new data!

To show the details for a note (as a little exercise) we create a new modal using the Ionic 6 sheet version with breakpoints which looks pretty cool. We pass in the ID of the note we want to open, so we can later load its data through our service.

For now open the src/app/home/home.page.ts and change it to:

import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, Note } from '../services/data.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  notes: Note[] = [];

  constructor(private dataService: DataService,  private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.dataService.getNotes().subscribe(res => {
      this.notes = res;
      this.cd.detectChanges();
    });
  }

  async addNote() {
    const alert = await this.alertCtrl.create({
      header: 'Add Note',
      inputs: [
        {
          name: 'title',
          placeholder: 'My cool note',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Learn Ionic',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.dataService.addNote({ text: res.text, title: res.title });
          }
        }
      ]
    });

    await alert.present();
  }

  async openNote(note: Note) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: note.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, Note } from '../services/data.service';
import { ModalPage } from '../modal/modal.page';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  notes: Note[] = [];
 
  constructor(private dataService: DataService,  private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.dataService.getNotes().subscribe(res => {
      this.notes = res;
      this.cd.detectChanges();
    });
  }
 
  async addNote() {
    const alert = await this.alertCtrl.create({
      header: 'Add Note',
      inputs: [
        {
          name: 'title',
          placeholder: 'My cool note',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Learn Ionic',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.dataService.addNote({ text: res.text, title: res.title });
          }
        }
      ]
    });
 
    await alert.present();
  }
 
  async openNote(note: Note) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: note.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });
 
    await modal.present();
  }
}
Note: Initially I had to use the Angular ChangeDetectorRef and manually trigger a change detection to update the view, in later tests it worked without. See what works for you, most likely you don’t need that part.

Now we just need to implement the modal with some additional functionality.

Update and Delete Firestore Documents
The last step is loading the detail data of a document, which you can do by using the ID that we define as @Input() and getting the document data from our service.

The other functions to delete and update a document work the same, simply by calling our service functionalities.

Therefore quickly open the src/app/modal/modal.page.ts and change it to:

import { Component, Input, OnInit } from '@angular/core';
import { Note, DataService } from '../services/data.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id: string;
  note: Note = null;

  constructor(private dataService: DataService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.dataService.getNoteById(this.id).subscribe(res => {
      this.note = res;
    });
  }

  async deleteNote() {
    await this.dataService.deleteNote(this.note)
    this.modalCtrl.dismiss();
  }

  async updateNote() {
    await this.dataService.updateNote(this.note);
    const toast = await this.toastCtrl.create({
      message: 'Note updated!.',
      duration: 2000
    });
    toast.present();

  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { Component, Input, OnInit } from '@angular/core';
import { Note, DataService } from '../services/data.service';
import { ModalController, ToastController } from '@ionic/angular';
 
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id: string;
  note: Note = null;
 
  constructor(private dataService: DataService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }
 
  ngOnInit() {
    this.dataService.getNoteById(this.id).subscribe(res => {
      this.note = res;
    });
  }
 
  async deleteNote() {
    await this.dataService.deleteNote(this.note)
    this.modalCtrl.dismiss();
  }
 
  async updateNote() {
    await this.dataService.updateNote(this.note);
    const toast = await this.toastCtrl.create({
      message: 'Note updated!.',
      duration: 2000
    });
    toast.present();
 
  }
}
The cool thing is that our document is also updated in realtime, just like the list based on the collection on our previous page.

So since we can now connect our ngModel input fields with our note, you could directly update the data inside Firestore and see the change in your Ionic app.

For the other direction, we still need to press the update button first so let’s wrap up the tutorial by adding the last items to show the input fields and two buttons to trigger all actions inside the src/app/modal/modal.page.html:

<ion-header>
  <ion-toolbar color="secondary">
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div *ngIf="note">
    <ion-item>
      <ion-label position="stacked">Title</ion-label>
      <ion-input [(ngModel)]="note.title"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Note</ion-label>
      <ion-textarea [(ngModel)]="note.text" rows="8"></ion-textarea>
    </ion-item>
  </div>

  <ion-button expand="block" color="success" (click)="updateNote()">
    <ion-icon name="save" slot="start"></ion-icon>
    Update
  </ion-button>
  <ion-button expand="block" color="danger" (click)="deleteNote()">
    <ion-icon name="trash" slot="start"></ion-icon>
    Delete
  </ion-button>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
<ion-header>
  <ion-toolbar color="secondary">
    <ion-title>Details</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <div *ngIf="note">
    <ion-item>
      <ion-label position="stacked">Title</ion-label>
      <ion-input [(ngModel)]="note.title"></ion-input>
    </ion-item>
 
    <ion-item>
      <ion-label position="stacked">Note</ion-label>
      <ion-textarea [(ngModel)]="note.text" rows="8"></ion-textarea>
    </ion-item>
  </div>
 
  <ion-button expand="block" color="success" (click)="updateNote()">
    <ion-icon name="save" slot="start"></ion-icon>
    Update
  </ion-button>
  <ion-button expand="block" color="danger" (click)="deleteNote()">
    <ion-icon name="trash" slot="start"></ion-icon>
    Delete
  </ion-button>
 
</ion-content>
And with that you have successfully finished the basic Firebase integration on which you could now add all further functionalities like user authentication or file upload.

Conclusion
Firebase remains one of the most popular choices for a cloud backend besides the upcoming star Supabase, which is an open source Firebase alternative.

I’ve personally used both and enjoy the different philosophies of SQL and NoSQL, but you can certainly build powerful apps with both cloud backend solutions!

You can also find a video version of this tutorial below.
[top](#ionic-academy)
<!-- # anchor -->
# How to use Ionic Storage v3 with Angular [v6]
Posted on August 17th, 2021

ionic-storage-v3-with-angular
Tweet
Email
WhatsApp
Share
Ionic Storage is a great package to easily store data inside your Ionic application using the best available storage mechanism, but many developers encountered problems after a recent upgrade to Ionic Storage v3.

In this Quick Win we will integrate Ionic Storage v3 and use the basic CRUD functionalities, but also take things a step further by using the SQLite database as the preferred option on a device which then causes some potential race conditions.

Setting up Ionic Storage
To get started, bring up a new Ionic application and install the Ionic Storage package, now using the exact storage-angular package when used with Ionic Angular:

ionic start academyStorage blank --type=angular --capacitor
cd ./academyStorage
npm i @ionic/storage-angular

ionic g service services/data
1
2
3
4
5
ionic start academyStorage blank --type=angular --capacitor
cd ./academyStorage
npm i @ionic/storage-angular
 
ionic g service services/data
On top of that I’ve generated a service so we can build our CRUD functionality in there.

To use storage we now also need to import it into our module, therefore open the src/app/app.module.ts and add it like this:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'mydb' // This is optional!
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
 
import { IonicStorageModule } from '@ionic/storage-angular';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'mydb' // This is optional!
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
The name for the database here is optional, and you can see all possible values in the according StorageConfig interface:

export interface StorageConfig {
    name?: string;
    version?: number;
    size?: number;
    storeName?: string;
    description?: string;
    driverOrder?: Driver[];
    dbKey?: string;
}
1
2
3
4
5
6
7
8
9
export interface StorageConfig {
    name?: string;
    version?: number;
    size?: number;
    storeName?: string;
    description?: string;
    driverOrder?: Driver[];
    dbKey?: string;
}
For now all of that doesn’t matter and we can continue with the usage.

Working with Ionic Storage
Before doing any operation with Ionic Storage we need to call the create() function to initialise the database correctly. This is basically the reason why old tutorials won’t work for you anymore, and for now we gonna add this call simply inside our service.

The rest of the service shows a basic usage of the get() function that returns the value for a specific key (I’ve put the key in a const to make life easier).

Additionally I expect that this key returns an array value, but especially the first time this will be undefined hence the “|| []” acts as a fallback that will return an empty array in those cases.

Now open the src/app/services/data.service.ts and change it to:

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const STORAGE_KEY = 'mylist';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {    
    await this.storage.create();
  }

  getData() {
    return this.storage.get(STORAGE_KEY) || [];
  }

  async addData(item) {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.push(item);
    return this.storage.set(STORAGE_KEY, storedData);
  }

  async remvoveItem(index) {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.splice(index, 1);
    return this.storage.set(STORAGE_KEY, storedData);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
 
const STORAGE_KEY = 'mylist';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  constructor(private storage: Storage) {
    this.init();
  }
 
  async init() {    
    await this.storage.create();
  }
 
  getData() {
    return this.storage.get(STORAGE_KEY) || [];
  }
 
  async addData(item) {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.push(item);
    return this.storage.set(STORAGE_KEY, storedData);
  }
 
  async remvoveItem(index) {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.splice(index, 1);
    return this.storage.set(STORAGE_KEY, storedData);
  }
}
We can now easily trigger all those functions to retrieve data from storage, add or delete data with our src/app/home/home.page.ts like this:

import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listData = [];

  constructor(private dataService: DataService) {
    this.loadData();
  }

  async loadData() {
    const data = await this.dataService.getData();
    this.listData = data;
  }

  async addData() {
    await this.dataService.addData(`Simon ${Math.floor(Math.random() * 100)}`);
    this.loadData();
  }

  async removeItem(index) {
    this.dataService.remvoveItem(index);
    this.listData.splice(index, 1);
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  listData = [];
 
  constructor(private dataService: DataService) {
    this.loadData();
  }
 
  async loadData() {
    const data = await this.dataService.getData();
    this.listData = data;
  }
 
  async addData() {
    await this.dataService.addData(`Simon ${Math.floor(Math.random() * 100)}`);
    this.loadData();
  }
 
  async removeItem(index) {
    this.dataService.remvoveItem(index);
    this.listData.splice(index, 1);
  }
}
Finally we need a simple view to show a list of our data, add new entries or remove them by using a sliding item. Therefore finally bring up the src/app/home/home.page.html and change it to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Storage v3
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-list>
    <ion-item-sliding *ngFor="let name of listData; let i = index;">

      <ion-item>
        {{ name }}
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option (click)="removeItem(i)">
          <ion-icon name="trash" slot="icon-only"></ion-icon>
        </ion-item-option>
      </ion-item-options>
      
    </ion-item-sliding>
  </ion-list>

  <ion-fab vertical="top" horizontal="end" slot="fixed">
    <ion-fab-button (click)="addData()" color="secondary">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Storage v3
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-list>
    <ion-item-sliding *ngFor="let name of listData; let i = index;">
 
      <ion-item>
        {{ name }}
      </ion-item>
 
      <ion-item-options side="end">
        <ion-item-option (click)="removeItem(i)">
          <ion-icon name="trash" slot="icon-only"></ion-icon>
        </ion-item-option>
      </ion-item-options>
      
    </ion-item-sliding>
  </ion-list>
 
  <ion-fab vertical="top" horizontal="end" slot="fixed">
    <ion-fab-button (click)="addData()" color="secondary">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
 
</ion-content>
Congratulations, you now got the basic implementation of Ionic Storage in place! But we won’t stop here because there’s still some work to make it even better.

Driver configuration for SQLite
By default Storage will select the best possible Storage engine, which means first IndexedDB and then localstorage. This is the default order, and what you usually use when your app runs on the browser.

But for a device, this might not be the most secure place as the OS of iOS and Android might decide to clear that storage at some point.

To achieve more secure persistence of your data, you should use the SQLite database when your app runs on a real device as a native app and therefore you can now add the cordova-sqlite-storage plugin which works with both Capacitor and Cordova apps:

# Cordova only
ionic cordova plugin add cordova-sqlite-storage

# Capacitor only
npm install cordova-sqlite-storage

# For both!
npm install localforage-cordovasqlitedriver
1
2
3
4
5
6
7
8
# Cordova only
ionic cordova plugin add cordova-sqlite-storage
 
# Capacitor only
npm install cordova-sqlite-storage
 
# For both!
npm install localforage-cordovasqlitedriver
After selecting the right package you also need to install the localforage-cordovasqlitedriver which is the driver to connect to the datbase.

Next step now is to add this driver to the first position of priority so it will be selected by Ionic Storage when available.

To do so, open the src/app/app.module.ts and change our initialisation to:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'mydb', // This is optional!
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
 
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'mydb', // This is optional!
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
Now that we’ve defined the driver order we also need to enable it, and we can do it right inside of our src/app/services/data.service.ts before we call the create() function:

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

const STORAGE_KEY = 'mylist';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {    
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }

  // All the code from before...
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
 
const STORAGE_KEY = 'mylist';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  constructor(private storage: Storage) {
    this.init();
  }
 
  async init() {    
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }
 
  // All the code from before...
}
Good job, your app will now use the SQLite database when available!

But wait.. What’s that in your log suddenly?

ionic-storage-race-condition
We are accessing storage (inside the getData() function) before the storage connection is established!

You can see this quite easily by putting some logs into the different functions and see which is printed first. Check out the video at the bottom to see it in action.

This means we have a race condition because we don’t handle the async nature of the storage creation correctly.

Handling async Storage creation
I found two ways to solve this problem, the first being super easy but potentially not 100% safe to use.

The idea is to call the init() earlier in our apps startup, and that means we could put a call to it directly into our src/app/app.component.ts:

import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataService) {
    this.dataService.init();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
import { Component } from '@angular/core';
import { DataService } from './services/data.service';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataService) {
    this.dataService.init();
  }
}
Then you would simply remove the call to init inside the service as we only need to call it once, and when you reload the app your error will be gone.

But here’s the catch: We are now calling it earlier, but that doesn’t mean it’s early enough. I haven’t tested all scenarios with this approach, but I feel like if the creation takes just a bit longer, our first call to get data from storage might still thrown an error if the storage isn’t fully created.

A more secure approach would wrap the state of the storage creation into a BehaviorSubject and wait until it’s definitely ready.

So for this second case, you can undo the changes from before again and change the service to hold a subject which turns to true when the creation is done.

Additionally, you would have to wrap the first (or all) calls to storage within that Subject, filter out the false values until it’s ready and then returning the data like before. But since we are now within an Observable, we need to use from() and of() to convert our Promise/Object to a real Observable again inside the switchMap block.

The code of our src/app/services/data.service.ts would change to this:

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

const STORAGE_KEY = 'mylist';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {   
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
  }

  getData() {
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {        
        return from(this.storage.get(STORAGE_KEY)) || of([]);
      })
    );
  }

  // Code from before..
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
 
const STORAGE_KEY = 'mylist';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);
 
  constructor(private storage: Storage) {
    this.init();
  }
 
  async init() {   
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
  }
 
  getData() {
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {        
        return from(this.storage.get(STORAGE_KEY)) || of([]);
      })
    );
  }
 
  // Code from before..
}
On top of that we now have to change the way we call that function since it returns an Observable, so we also need to change the src/app/home/home.page.ts to:

import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listData = [];

  constructor(private dataService: DataService) {
    this.loadData();
  }

  async loadData() {
    // const data = await this.dataService.getData();
    // We are dealing with an Observable now!
    this.dataService.getData().subscribe(res => {
      this.listData = res;
    });
  }

  // Code from before..
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  listData = [];
 
  constructor(private dataService: DataService) {
    this.loadData();
  }
 
  async loadData() {
    // const data = await this.dataService.getData();
    // We are dealing with an Observable now!
    this.dataService.getData().subscribe(res => {
      this.listData = res;
    });
  }
 
  // Code from before..
}
This approach is more complicated now, but would make sure the storage is definitely created before accessing it. Feel free to use the first, way easier approach in your apps but keep an eye on any potential issue that could arise from storage creation taking longer than expected!

Conclusion
Using Ionic Storage v3 is in general just the same as before, the only thing that changed is the creation of the storage connection and then handling of drivers, which in my eyes feels even better than before.

For more information check out the previous post about implementing CRUD functionalities with Ionic Storage to see some basic examples on how to work with data in storage!

You can also find a video version of this Quick Win below.
[top](#ionic-academy)
<!-- # anchor -->
# How to Handle User Roles in Ionic Apps with Guard & Directives
Posted on April 20th, 2021

user-roles-ionic
Tweet
Email
WhatsApp
Share
When working with user accounts, you sometimes need to handle multiple user roles within your Ionic app or even specific permissions users might have

In this tutorial we will handle both cases with different user roles as well as more fine granulated user permission for specific actions.

We’ll not build a backend and rely on some fake dummy data, but we’ll make sure our Ionic app handles roles and permissions correctly.

ionic-roles-app
That means we will hide certain elements based on roles using directives, or prevents access to pages with detailed role check through a guard!

Get the Code.
Receive all Ionic code files directly to your inbox!

First Name
Your email address

Send me the code!
We won't send you spam. Unsubscribe at any time.

Starting our Roles App
To get started, we bring up a blank new Ionic app and generate two pages, a service that holds the state of our user, two directives to show/hide elements based on roles or permissions and finally a guard to protect our inside pages:

ionic start devdacticRoles blank --type=angular --capacitor
cd ./devdacticRoles

# Pages for testing
ionic g page pages/login
ionic g page pages/secret

# Handle the current user
ionic g service services/auth

ionic g module directives/SharedDirectives --flat
ionic g directive directives/hasPermission   
ionic g directive directives/disableRole

# Guard to protect pages
ionic g guard guards/auth --implements CanActivate
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
ionic start devdacticRoles blank --type=angular --capacitor
cd ./devdacticRoles
 
# Pages for testing
ionic g page pages/login
ionic g page pages/secret
 
# Handle the current user
ionic g service services/auth
 
ionic g module directives/SharedDirectives --flat
ionic g directive directives/hasPermission   
ionic g directive directives/disableRole
 
# Guard to protect pages
ionic g guard guards/auth --implements CanActivate
To apply the new routes we can already change our setup inside the src/app/app-routing.module.ts now:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'secret',
    loadChildren: () => import('./pages/secret/secret.module').then( m => m.SecretPageModule),
    canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
 
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'secret',
    loadChildren: () => import('./pages/secret/secret.module').then( m => m.SecretPageModule),
    canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  }
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
We already see the first element, the authentication guard applied to our internal area routes. Right now it will allow all access, but we will build this out later so we either allow access only for authorised users (like the home route) or make this even dependent on a user role (like the secret route).

Authentication Service & Dummy Login
Before we dive into our directives and guards, we first need a bit of logic to fake the login process that usually makes a call to your backend and gets back the user information and any potential roles or permissions for a certain user.

Like done before, we will handle the current user information with a BehaviorSubject to which we can easily emit new values.

Here are our functions in detail:

loadUser: Try to load a token or user information from Storage right in the beginning. We have some plain information, but you usually have something like a JWT in there so you can directly log in a user
signIn: Our dummy login function that simply checks the name and fakes information that you would get from a server. We got a standard user with basic permissions and an admin user, but you could of course have even more in your app.
hasPermission: Check if inside the array of a user a set of permissions is included
Besides that we only return an Observable of our BehaviourSubject so outside pages can’t change the value and only read and subscribe to the changes. The logout in the end will clear all user information and bring us back to the login.

Go ahead with our dummy service and change the src/app/services/auth.service.ts to:

import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';

const { Storage } = Plugins;

const TOKEN_KEY = 'user-token';

export interface User {
  name: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private router: Router) {
    this.loadUser();
  }

  loadUser() {
    // Normally load e.g. JWT at this point
    Storage.get({ key: TOKEN_KEY }).then(res => {
      if (res.value) {
        this.currentUser.next(JSON.parse(res.value));
      } else {
        this.currentUser.next(false);
      }
    });
  }

  signIn(name) {
    // Local Dummy check, usually server request!
    let userObj: User;

    if (name === 'user') {
      userObj = {
        name: 'Tony Test',
        role: 'USER',
        permissions: ['read']
      };
    } else if (name === 'admin') {
      userObj = {
        name: 'Adam Admin',
        role: 'ADMIN',
        permissions: ['read', 'write']
      };
    }

    return of(userObj).pipe(
      tap(user => {
        // Store the user or token
        Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) })
        this.currentUser.next(user);
      })
    );
  }

  // Access the current user
  getUser() {
    return this.currentUser.asObservable();
  }

  // Remove all information of the previous user
  async logout() {
    await Storage.remove({ key: TOKEN_KEY });
    this.currentUser.next(false);
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  // Check if a user has a certain permission
  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.currentUser.value || !this.currentUser.value.permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
 
const { Storage } = Plugins;
 
const TOKEN_KEY = 'user-token';
 
export interface User {
  name: string;
  role: string;
  permissions: string[];
}
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
 
  constructor(private router: Router) {
    this.loadUser();
  }
 
  loadUser() {
    // Normally load e.g. JWT at this point
    Storage.get({ key: TOKEN_KEY }).then(res => {
      if (res.value) {
        this.currentUser.next(JSON.parse(res.value));
      } else {
        this.currentUser.next(false);
      }
    });
  }
 
  signIn(name) {
    // Local Dummy check, usually server request!
    let userObj: User;
 
    if (name === 'user') {
      userObj = {
        name: 'Tony Test',
        role: 'USER',
        permissions: ['read']
      };
    } else if (name === 'admin') {
      userObj = {
        name: 'Adam Admin',
        role: 'ADMIN',
        permissions: ['read', 'write']
      };
    }
 
    return of(userObj).pipe(
      tap(user => {
        // Store the user or token
        Storage.set({ key: TOKEN_KEY, value: JSON.stringify(user) })
        this.currentUser.next(user);
      })
    );
  }
 
  // Access the current user
  getUser() {
    return this.currentUser.asObservable();
  }
 
  // Remove all information of the previous user
  async logout() {
    await Storage.remove({ key: TOKEN_KEY });
    this.currentUser.next(false);
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
 
  // Check if a user has a certain permission
  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.currentUser.value || !this.currentUser.value.permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }
}
Note that we always emit false to the current user when we log out or don’t have stored information, which is necessary to distinguish from the initial null value of our Behaviour Subject!

Now we can create a simple login inside the src/app/pages/login/login.page.ts by using our service:

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() { }

  signIn(userName) {
    this.auth.signIn(userName).subscribe(user => {
      // You could now route to different pages
      // based on the user role
      // let role = user['role'];

      this.router.navigateByUrl('/home', {replaceUrl: true });
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  constructor(private auth: AuthService, private router: Router) { }
 
  ngOnInit() { }
 
  signIn(userName) {
    this.auth.signIn(userName).subscribe(user => {
      // You could now route to different pages
      // based on the user role
      // let role = user['role'];
 
      this.router.navigateByUrl('/home', {replaceUrl: true });
    });
  }
}
We don’t use role based routing in this tutorial, but you could now easily guide users to different pages inside your app based on the role after the login!

To use the login we finally also need a simple view, so change the src/app/pages/login/login.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Role Auth
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content padding>
  <ion-button expand="full" (click)="signIn('admin')">Login as Admin</ion-button>
  <ion-button expand="full" (click)="signIn('user')">Login as User</ion-button>

  <ion-button expand="full" routerLink="/home">
    Open home page (Authorized only)</ion-button>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Ionic Role Auth
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content padding>
  <ion-button expand="full" (click)="signIn('admin')">Login as Admin</ion-button>
  <ion-button expand="full" (click)="signIn('user')">Login as User</ion-button>
 
  <ion-button expand="full" routerLink="/home">
    Open home page (Authorized only)</ion-button>
</ion-content>
Now we can already navigate inside our app, but we don’t really have any kind of authentication in place yet.

Protecting Pages with a Guard
First of all we will protect the pages that only logged in users should be able to see. Keep in mind that this is only half of the security, the more important security always happens inside your API and all your endpoints should be protected accordingly.

Anyway, we need a way to change between users so let’s start by adding a quick logout to the src/app/home/home.page.ts:

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user = this.authService.getUser();
  
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  user = this.authService.getUser();
  
  constructor(private authService: AuthService) {}
 
  logout() {
    this.authService.logout();
  }
}
To call the function, we will also add a button to the src/app/home/home.page.html and print out some information about the current user for debugging:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Inside Area
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>

  <ion-card>
    <ion-card-content>
      <p>Current user: {{ user | async | json }}</p>
    </ion-card-content>
  </ion-card>

  <ion-button expand="full" routerLink="/secret">
    Open secret page (Admin only)</ion-button>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Inside Area
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <ion-card>
    <ion-card-content>
      <p>Current user: {{ user | async | json }}</p>
    </ion-card-content>
  </ion-card>
 
  <ion-button expand="full" routerLink="/secret">
    Open secret page (Admin only)</ion-button>
 
</ion-content>
To complete the navigation you can also add a little back button to the src/app/pages/secret/secret.page.html:

<ion-header>
  <ion-toolbar color="secondary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Secret Admin Page</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
<ion-header>
  <ion-toolbar color="secondary">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>
    <ion-title>Secret Admin Page</ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
</ion-content>
Now the protection starts: We want to prevent unauthorised access, and if any specific role for a route was supplied (check back the app.routing and the role we added!) we also want to make sure the user has that role.

Within the guard we can now use the Observable from our service, filter out the initial null value and then check if the user is authenticated in general, and if there are any roles specified for this route, we also check if the user has the necessary role.

Go ahead and change the src/app/guards/auth.guard.ts to this now:

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { take, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private alertCtrl: AlertController) { }


  canActivate(route: ActivatedRouteSnapshot) {
    // Get the potentially required role from the route
    const expectedRole = route.data?.role || null;

    return this.authService.getUser().pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1),
      map(user => {   
             
        if (!user) {
          this.showAlert();
          return this.router.parseUrl('/')
        } else {
          let role = user['role'];

          if (!expectedRole || expectedRole == role) {
            return true;
          } else {
            this.showAlert();
            return false;
          }
        }
      })
    )
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page!',
      buttons: ['OK']
    });
    alert.present();
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { take, map, filter } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router, private authService: AuthService, private alertCtrl: AlertController) { }
 
 
  canActivate(route: ActivatedRouteSnapshot) {
    // Get the potentially required role from the route
    const expectedRole = route.data?.role || null;
 
    return this.authService.getUser().pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1),
      map(user => {   
             
        if (!user) {
          this.showAlert();
          return this.router.parseUrl('/')
        } else {
          let role = user['role'];
 
          if (!expectedRole || expectedRole == role) {
            return true;
          } else {
            this.showAlert();
            return false;
          }
        }
      })
    )
  }
 
  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page!',
      buttons: ['OK']
    });
    alert.present();
  }
}
Now the guard works and you can test the behaviour with our two users, from which only the admin is allowed to enter the secret page.

Note: We used canActivate for our guard here instead of canLoad. The different is usually that the later prevents loading of the module, while the first will actually load the module but then prevent access to the page.

However, if a user accessed a page that is protected with a canLoad guard, the module loads. If the user now signs out and another user signs in on that same device, that user would always have access to the route as well because the module was now loaded already!

It’s something to keep in mind when picking the right guard functionality for your app.

Custom Role Directives
After protecting full pages, we go into more details about specific elements inside a page. And if you want to change how certain elements work based on user roles and permissions, you can create some cool directives!

First of all we need to make sure that other pages can use the directives we generated in the beginning, so open the
src/app/directives/shared-directives.module.ts and add them to the exports and declarations:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableRoleDirective } from './disable-role.directive';
import { HasPermissionDirective } from './has-permission.directive';

@NgModule({
  declarations: [HasPermissionDirective, DisableRoleDirective],
  imports: [
    CommonModule
  ],
  exports: [HasPermissionDirective, DisableRoleDirective]
})
export class SharedDirectivesModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableRoleDirective } from './disable-role.directive';
import { HasPermissionDirective } from './has-permission.directive';
 
@NgModule({
  declarations: [HasPermissionDirective, DisableRoleDirective],
  imports: [
    CommonModule
  ],
  exports: [HasPermissionDirective, DisableRoleDirective]
})
export class SharedDirectivesModule { }
Now we can dive into the first of our directives that should prevent a user from seeing a certain DOM element. To achieve this, we can use the reference to the template where our directive is attached and either call createEmbeddedView() to embed the element or clear() to remove it, based on the permission of a user.

The permissions will be passed to the directive through the @Input() we defined at the top, and will be checked with the hasPermission() of our service.

Get started with the first directive by changing the src/app/directives/has-permission.directive.ts to:

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  @Input('appHasPermission') permissions: string[];

  constructor(private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  ngOnInit() {
    this.authService.getUser().subscribe(_ => {
      if (this.authService.hasPermission(this.permissions)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
 
@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
 
  @Input('appHasPermission') permissions: string[];
 
  constructor(private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
 
  ngOnInit() {
    this.authService.getUser().subscribe(_ => {
      if (this.authService.hasPermission(this.permissions)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
The second directive should disabled a view element for a specific role of a user, which will again be passed to the directive. Tip: If you name the input exactly like the directive itself you can later pass that value quite easily to the directive!

We follow mostly the same approach but use the Renderer2 to directly change the appearance of the host element where the directive is attached.

Go ahead now and also change the src/app/directives/disable-role.directive.ts to:

import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appDisableRole]'
})
export class DisableRoleDirective {

  @Input() disableForRole: string;

  constructor(private authService: AuthService,
    private renderer: Renderer2,
    public element: ElementRef) { }

  ngAfterViewInit() {
    this.authService.getUser().subscribe(user => {
      const userRole = user['role'];

      if (userRole == this.disableForRole) {
        this.renderer.setStyle(this.element.nativeElement, 'pointer-events', 'none');
        this.renderer.setStyle(this.element.nativeElement, 'opacity', 0.4);
      }
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth.service';
 
@Directive({
  selector: '[appDisableRole]'
})
export class DisableRoleDirective {
 
  @Input() disableForRole: string;
 
  constructor(private authService: AuthService,
    private renderer: Renderer2,
    public element: ElementRef) { }
 
  ngAfterViewInit() {
    this.authService.getUser().subscribe(user => {
      const userRole = user['role'];
 
      if (userRole == this.disableForRole) {
        this.renderer.setStyle(this.element.nativeElement, 'pointer-events', 'none');
        this.renderer.setStyle(this.element.nativeElement, 'opacity', 0.4);
      }
    });
  }
}
With our directives in place we now need to load the module which exports the directives in the module where we plan to use them, in our case that’s the src/app/home/home.module.ts:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
Finally we can attach our new directives to DOM elements to either hide them completely based on a permission (*appHasPermission) or otherwise disabled them based on a specific role (appDisableRole).

Wrap up our code by changing the src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Inside Area
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>

  <!-- Everything from before... -->

  <ion-card *appHasPermission="['read']">
    <ion-card-header>
      <ion-card-title>My Content</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Everyone can read this
      <ion-button expand="full" *appHasPermission="['write']">
        Admin action
      </ion-button>
    </ion-card-content>
  </ion-card>

  <ion-button expand="full" appDisableRole disableForRole="USER">Action for Admins</ion-button>
  <ion-button expand="full" appDisableRole disableForRole="ADMIN">Action for Users</ion-button>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Inside Area
    </ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="logout()">
        <ion-icon slot="icon-only" name="log-out"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 
  <!-- Everything from before... -->
 
  <ion-card *appHasPermission="['read']">
    <ion-card-header>
      <ion-card-title>My Content</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      Everyone can read this
      <ion-button expand="full" *appHasPermission="['write']">
        Admin action
      </ion-button>
    </ion-card-content>
  </ion-card>
 
  <ion-button expand="full" appDisableRole disableForRole="USER">Action for Admins</ion-button>
  <ion-button expand="full" appDisableRole disableForRole="ADMIN">Action for Users</ion-button>
</ion-content>
Now the button inside the card is only visible to users with the “write” permission, and the button below is only active for a specific role!

Conclusion
To protect your Ionic app based on user roles and permissions you can introduce guards and directives to control access to pages and even to specific view elements.

On top of that you could route after a login to different pages or set up menu items based on the user role as well to create applications with different functionality for different users without having if statements all over your apps code!

You can also find a video version of this tutorial below

[top](#ionic-academy)
<!-- # anchor -->
# How to Force Update Ionic Apps [v5]
Posted on March 16th, 2021

force-update-ionic-app
Tweet
Email
WhatsApp
Share
Usually you don’t have a lot of control about the installed apps your users continue to use, so if you want to make sure they use the latest version, you have to somehow force update their Ionic apps.

In this Quick Win we will implement a manual update logic for your Ionic app. There is also another whole package that you could use, but we will keep it simple without introducing another library.

force-update-ionic-app
We will check the content of a hosted JSON file, compare it to the local app version number and display different alerts based on the compared information so users can directly open the app store to download the latest version.


Starting our App
We start with blank new Ionic application with Capacitor enabled and install a bunch of plugins:

The app version plugin to read the version number of the installed app
The Capacitor community plugin to open the app store
The in app browser plugin since the Capacitor plugin didn’t work for iOS at the time writing
The last plugin is hopefully not necessary in the future when the Capacitor plugin works correctly for all platforms. For now though go ahead and create the app with all plugins like this:

ionic start academyUpdate blank --type=angular --capacitor
cd ./academyUpdate

ionic g service services/update

// Plugin to get the app version
npm i @ionic-native/core
npm i cordova-plugin-app-version @ionic-native/app-version

// Plugin to open the app store on iOS
npm install cordova-plugin-inappbrowser @ionic-native/in-app-browser

// Capacitor plugin to open app stores
npm install @capacitor-community/native-market
1
2
3
4
5
6
7
8
9
10
11
12
13
14
ionic start academyUpdate blank --type=angular --capacitor
cd ./academyUpdate
 
ionic g service services/update
 
// Plugin to get the app version
npm i @ionic-native/core
npm i cordova-plugin-app-version @ionic-native/app-version
 
// Plugin to open the app store on iOS
npm install cordova-plugin-inappbrowser @ionic-native/in-app-browser
 
// Capacitor plugin to open app stores
npm install @capacitor-community/native-market
To make use of our plugins and also make HTTP calls, we now need to import everything correctly inside our app/app.module.ts:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppVersion,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
 
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppVersion,
    InAppBrowser
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
If you are using Capacitor 2 you also need to manually import and add the plugin inside the Android main activity at android/app/src/main/java/io/ionic/starter/MainActivity.java:

package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import com.getcapacitor.community.nativemarket.NativeMarket;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(NativeMarket.class);
    }});
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
package io.ionic.starter;
 
import android.os.Bundle;
 
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
 
import java.util.ArrayList;
import com.getcapacitor.community.nativemarket.NativeMarket;
 
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
 
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(NativeMarket.class);
    }});
  }
}
This might not be required in the future with Capacitor 3 anymore!

Implement the App Update Logic
The whole logic relies on a JSON file hosted on a server, which is checked whenever the app starts. If the user has no internet connection, then there’s anyway no chance to know about the current version and the whole logic won’t work.

I’ve prepared two files for our case, the first one is meant to be used when the app should be disabled for a short duration due to some maintenance update, and I’ve uploaded it here:

{
  "enabled": false,
  "msg": {
    "title": "App maintenance",
    "msg": "We are currently improving your app experience. Please try again later..."
  }
}
1
2
3
4
5
6
7
{
  "enabled": false,
  "msg": {
    "title": "App maintenance",
    "msg": "We are currently improving your app experience. Please try again later..."
  }
}
We will read out that information inside the app to show the according alert and block the application from further usage.

If you released an update of your app and want to make sure users either have to update or can update their app, the following information that I hosted here will work:

{
  "current": "1.5.0",
  "enabled": true,
  "majorMsg": {
    "title": "Important App update",
    "msg": "Please update your app to the latest version to continue using it.",
    "btn": "Download"
  },
  "minorMsg": {
    "title": "App update available",
    "msg": "There's a new version available, would you like to get it now?",
    "btn": "Download"
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
{
  "current": "1.5.0",
  "enabled": true,
  "majorMsg": {
    "title": "Important App update",
    "msg": "Please update your app to the latest version to continue using it.",
    "btn": "Download"
  },
  "minorMsg": {
    "title": "App update available",
    "msg": "There's a new version available, would you like to get it now?",
    "btn": "Download"
  }
}
In this case we can show different information after checking if the major version or minor version of the current app has changed in relation to the installed apps version.

Now we can create our service that makes an HTTP request to fetch one of these dummy files. We then need to check:

Should the app be disabled? Display an alert with some information and don’t show any buttons and block the backdrop dismiss
If the app is enabled, we check the version from the JSON file and retrieve our own version number using the according plugin
Compare the splitted strings to first see if the major version is different and then the minor, and show according alerts for each case
I also added a simple interface for our JSON file with optional data which makes accessing the values easier.

Go ahead and implement the first part of our logic inside the services/update.service.ts:

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const { NativeMarket } = Plugins;

interface AppUpdate {
  current: string;
  enabled: boolean;
  msg?: {
    title: string;
    msg: string;
    btn: string;
  };
  majorMsg?: {
    title: string;
    msg: string;
    btn: string;
  };
  minorMsg?: {
    title: string;
    msg: string;
    btn: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updateExample = 'https://devdactic.fra1.digitaloceanspaces.com/tutorial/version.json';
  maintenanceExample = 'https://devdactic.fra1.digitaloceanspaces.com/tutorial/maintenance.json';

  constructor(private http: HttpClient, private alertCtrl: AlertController, private appVersion: AppVersion,
    private iab: InAppBrowser, private plt: Platform) { }

  async checkForUpdate() {
    this.http.get(this.updateExample).subscribe(async (info: AppUpdate) => {
      if (!info.enabled) {
        // App should be disabled right now
        this.presentAlert(info.msg.title, info.msg.msg);
      } else {
        // Compare major/minor versions and show according info
        const versionNumber = await this.appVersion.getVersionNumber();
        const splittedVersion = versionNumber.split('.');
        const serverVersion = info.current.split('.');

        // Check Major code, then minor code
        if (serverVersion[0] > splittedVersion[0]) {
          this.presentAlert(info.majorMsg.title, info.majorMsg.msg, info.majorMsg.btn);
        } else if (serverVersion[1] > splittedVersion[1]) {
          this.presentAlert(info.minorMsg.title, info.minorMsg.msg, info.minorMsg.btn, true);
        }
      }
    });
  }

  openAppstoreEntry() {
    // TODO
  }

  async presentAlert(header, message, buttonText = '', allowClose = false) {
    // TODO
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
 
const { NativeMarket } = Plugins;
 
interface AppUpdate {
  current: string;
  enabled: boolean;
  msg?: {
    title: string;
    msg: string;
    btn: string;
  };
  majorMsg?: {
    title: string;
    msg: string;
    btn: string;
  };
  minorMsg?: {
    title: string;
    msg: string;
    btn: string;
  }
}
 
@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updateExample = 'https://devdactic.fra1.digitaloceanspaces.com/tutorial/version.json';
  maintenanceExample = 'https://devdactic.fra1.digitaloceanspaces.com/tutorial/maintenance.json';
 
  constructor(private http: HttpClient, private alertCtrl: AlertController, private appVersion: AppVersion,
    private iab: InAppBrowser, private plt: Platform) { }
 
  async checkForUpdate() {
    this.http.get(this.updateExample).subscribe(async (info: AppUpdate) => {
      if (!info.enabled) {
        // App should be disabled right now
        this.presentAlert(info.msg.title, info.msg.msg);
      } else {
        // Compare major/minor versions and show according info
        const versionNumber = await this.appVersion.getVersionNumber();
        const splittedVersion = versionNumber.split('.');
        const serverVersion = info.current.split('.');
 
        // Check Major code, then minor code
        if (serverVersion[0] > splittedVersion[0]) {
          this.presentAlert(info.majorMsg.title, info.majorMsg.msg, info.majorMsg.btn);
        } else if (serverVersion[1] > splittedVersion[1]) {
          this.presentAlert(info.minorMsg.title, info.minorMsg.msg, info.minorMsg.btn, true);
        }
      }
    });
  }
 
  openAppstoreEntry() {
    // TODO
  }
 
  async presentAlert(header, message, buttonText = '', allowClose = false) {
    // TODO
  }
}
Now we create the function that shows our alert. We dynamically generated the buttons based on the arguments that were passed to the function.

If an update is available, we display the download button attach a handler to the click action that calls our openAppstoreEntry() function.

If closing the alert is allowed, we also add a close button and enable the backdrop dismiss click as well. That means, we have a total of 3 different cases handled by our function now!

Finally if the user want’s to download the latest version (because automatic updates are turned off) we open the appstore either using the NativeMarket Capacitor plugin, but since it didn’t work on iOS for me we use the in app browser as a fallback in that case.

Of course use your own bundle ID and the ID from your iOS application instead of mine! I simply used the information from my simple Insta Companion app.

Now open the services/update.service.ts again and complete the two missing functions:

  openAppstoreEntry() {
    // Use your apps bundle ID and iOS ID!
    if (this.plt.is('android')) {
      NativeMarket.openStoreListing({
        appId: 'com.devdactic.igcompanion',
      });
    } else {
      this.iab.create('itms-apps://itunes.apple.com/app/id1469563885', '_blank');
    }

  }

  async presentAlert(header, message, buttonText = '', allowClose = false) {
    const buttons: any = [];

    if (buttonText != '') {
      buttons.push({
        text: buttonText,
        handler: () => {
          this.openAppstoreEntry();
        }
      })
    }

    if (allowClose) {
      buttons.push({
        text: 'Close',
        role: 'cancel'
      });
    }

    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss: allowClose
    });

    await alert.present();
  }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
  openAppstoreEntry() {
    // Use your apps bundle ID and iOS ID!
    if (this.plt.is('android')) {
      NativeMarket.openStoreListing({
        appId: 'com.devdactic.igcompanion',
      });
    } else {
      this.iab.create('itms-apps://itunes.apple.com/app/id1469563885', '_blank');
    }
 
  }
 
  async presentAlert(header, message, buttonText = '', allowClose = false) {
    const buttons: any = [];
 
    if (buttonText != '') {
      buttons.push({
        text: buttonText,
        handler: () => {
          this.openAppstoreEntry();
        }
      })
    }
 
    if (allowClose) {
      buttons.push({
        text: 'Close',
        role: 'cancel'
      });
    }
 
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss: allowClose
    });
 
    await alert.present();
  }
The last step is to call our logic in the right place, and the earliest place is inside the app/app.component.ts when our platform is ready:

import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private plt: Platform, private updateService: UpdateService) {
    this.plt.ready().then(() => {
      this.updateService.checkForUpdate();
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UpdateService } from './services/update.service';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private plt: Platform, private updateService: UpdateService) {
    this.plt.ready().then(() => {
      this.updateService.checkForUpdate();
    });
  }
}
Now you can deploy the app to your device with different versions and see the result in action!

Testing
I recommend you host your own JSON file so you can change it in the future of course. Besides that, you can always change your version number for iOS inside the ios/App/App/Info.plist or right inside Xcode:

ios-update-version-change
For Android you can also change this from code inside the android/app/build.gradle and search for the versionName string!

Conclusion
With this simple logic you can make sure your app always checks for an update when starting. Right now there’s a little trick to overcome the alert by following the download and then navigating back to the app, which “unlocks” the app.

To make sure your app is 100% of the time running this logic, you could easily run this logic in the platform resume event whenever your app enters the screen again.

You can also find a video version of this Quick Win below

[top](#ionic-academy)
<!-- # anchor -->
# Hosting an Ionic PWA with API Caching on Netlify
Posted on December 29th, 2020

ionic-pwa-caching-netlify
Tweet
Email
WhatsApp
Share
If you want to improve the offline experience of your Ionic PWA, it’s actually quite easy to not only cache the static assets but also cache the API calls inside an Ionic PWA!

In this tutorial we will build a simple PWA and work with different caching strategies for different API endpoints.
ionic-pwa-caching

We will also prepare our final PWA and upload it to Netlify, which is a service for hosting web projects that you can get started with for free. You can give my PWA from this tutorial a try here!

Setup your Ionic PWA
To get started, simply create a blank new Ionic project and add the Angular schematic for PWAs which makes our app basically ready as a PWA:

ionic start devdacticPwa blank --type=angular --capacitor
cd ./devdacticPwa
ng add @angular/pwa
1
2
3
ionic start devdacticPwa blank --type=angular --capacitor
cd ./devdacticPwa
ng add @angular/pwa
The schematic will inject a bunch of files, but we will not fine tune the apperance of our PWA in this tutorial.

If you want more in-depth knowledge about Ionic PWAs, check out the courses inside the Ionic Academy!

Since we want to perform API calls, we also need to add the HttpClientModule like we always do inside our app/app.module.ts:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
 
import { HttpClientModule } from '@angular/common/http';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
Now let’s add the basic logic for our API calls to the app.

Adding a simple API call to your Ionic PWA
We will make two different API calls in this app so we can later see the different caching strategies for our service worker.

Randomuser API
Chuck Norris Jokes
Both of them are free to use and we only want to test a few basic things, so they are enough in our case.

To show the current state of our network we can also listen to the networkStatusChange using the Capacitor network plugin. This allows us to even better see and understand how our Ionic PWa works in different scenarios.
Now go ahead and change the home/home.page.ts to:

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  users = [];
  joke = null;
  appIsOnline = true;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.appIsOnline = status.connected;

    Network.addListener('networkStatusChange', (status) => {
      this.appIsOnline = status.connected;
    });
  }

  getData() {
    this.http.get('https://randomuser.me/api/?results=5').subscribe(result => {
      console.log('results: ', result);
      this.users = result['results'];
    });
  }

  getOnlineData() {
    this.http.get('https://api.chucknorris.io/jokes/random').subscribe(result => {
      console.log('joke result: ', result);
      this.joke = result;
    });
  }

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Network } = Plugins;
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  users = [];
  joke = null;
  appIsOnline = true;
 
  constructor(private http: HttpClient) { }
 
  async ngOnInit() {
    const status = await Network.getStatus();
    this.appIsOnline = status.connected;
 
    Network.addListener('networkStatusChange', (status) => {
      this.appIsOnline = status.connected;
    });
  }
 
  getData() {
    this.http.get('https://randomuser.me/api/?results=5').subscribe(result => {
      console.log('results: ', result);
      this.users = result['results'];
    });
  }
 
  getOnlineData() {
    this.http.get('https://api.chucknorris.io/jokes/random').subscribe(result => {
      console.log('joke result: ', result);
      this.joke = result;
    });
  }
 
}
Nothing really special, and in fact nothing related to PWAs or caching?

Yes, that’s right! The service worker configuration happens in a different place, and our app works just fine during testing without the service worker.

For the view, we can simply print out different values from the API calls and add an ion-footer so we can directly show when the network state in our app changes.

Open the home/home.page.html and replace it with:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic PWA
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-button expand="block" (click)="getData()">Get Data</ion-button>
  <ion-button expand="block" (click)="getOnlineData()">Get Online Data</ion-button>

  <ion-card *ngIf="joke">
    <ion-card-content>
      {{ joke.value }}
    </ion-card-content>
  </ion-card>

  <ion-list>
    <ion-item *ngFor="let user of users">
      <ion-avatar slot="start">
        <img [src]="user.picture.thumbnail">
      </ion-avatar>
      <ion-label>
        <h2 class="ion-text-capitalize">{{ user.name.first }} {{ user.name.last }}</h2>
        <p>{{ user.email }}</p>
      </ion-label>
    </ion-item>
  </ion-list>

</ion-content>

<ion-footer>
  <ion-toolbar color="primary" *ngIf="appIsOnline">
    <ion-title>You are online :)</ion-title>
  </ion-toolbar>
  <ion-toolbar color="danger" *ngIf="!appIsOnline">
    <ion-title>You are offline :(</ion-title>
  </ion-toolbar>
</ion-footer>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic PWA
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <ion-button expand="block" (click)="getData()">Get Data</ion-button>
  <ion-button expand="block" (click)="getOnlineData()">Get Online Data</ion-button>
 
  <ion-card *ngIf="joke">
    <ion-card-content>
      {{ joke.value }}
    </ion-card-content>
  </ion-card>
 
  <ion-list>
    <ion-item *ngFor="let user of users">
      <ion-avatar slot="start">
        <img [src]="user.picture.thumbnail">
      </ion-avatar>
      <ion-label>
        <h2 class="ion-text-capitalize">{{ user.name.first }} {{ user.name.last }}</h2>
        <p>{{ user.email }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
 
</ion-content>
 
<ion-footer>
  <ion-toolbar color="primary" *ngIf="appIsOnline">
    <ion-title>You are online :)</ion-title>
  </ion-toolbar>
  <ion-toolbar color="danger" *ngIf="!appIsOnline">
    <ion-title>You are offline :(</ion-title>
  </ion-toolbar>
</ion-footer>
Right now the app will already work as expected inside a browser, but we are not yet using the full power of the service worker.

Caching API Calls inside your Ionic PWA
If we would build our app right now as a PWA, it would work like the web version: You get data when you are online, you get an error and no data when you are offline.

But we can improve that behaviour with caching strategies that we pass to the service worker that works in the background of our PWA.

This worker already downloads all the static files of our app when we install the app as a PWA, and we can do even more by configuring different API endpoints that we also want to cache.

In our case we got two endpoints, and you can use multiple URLs or wildcards and entries to define different strategies for different endpoints. Sounds complicated, but it’s just flexible.

In our case, we will use both strategies:

freshness: This strategy means we want to get the most up to date data from the API, and only present a cached version after the timeout specified.
performance: Show data as fast as possible, so if anything is cached, it will be returned immediately from there instead of calling the API.
To use this information, open your ngsw-config.json and add the following entry on the top level next to the already existing assetGroups which are used for caching static files:

  "dataGroups": [
    {
      "name": "joke",
      "version": 1,
      "urls": ["https://api.chucknorris.io/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 5,
        "maxAge": "5h",
        "timeout": "3s"
      }
    },
    {
      "name": "randomuser-api",
      "version": 1,
      "urls": ["https://randomuser.me/api/?results=5"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 10,
        "maxAge": "20s",
        "timeout": "3s"
      }
    }
  ],
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
  "dataGroups": [
    {
      "name": "joke",
      "version": 1,
      "urls": ["https://api.chucknorris.io/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 5,
        "maxAge": "5h",
        "timeout": "3s"
      }
    },
    {
      "name": "randomuser-api",
      "version": 1,
      "urls": ["https://randomuser.me/api/?results=5"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 10,
        "maxAge": "20s",
        "timeout": "3s"
      }
    }
  ],
Now we can finally test our PWA, and the easiest way is to run a production build and a local server to serve the files using the http-server:

ionic build --prod
http-server www
1
2
ionic build --prod
http-server www
After running this you can inspect your app on http://127.0.0.1:8080 and play around with the PWA.

Note: If you get any problems during testing, simply click “Clear site data” inside the Application -> Clear storage menu of your browser debugging tools!

You can first make a standard request with your PWA being online, then you can go into offline mode inside the Network tab of your developer tools.

When you now run the requests again, you will see that the requests you make are filled by the service worker:
ionic-pwa-service-worker

You can see two succeeded calls handled by the SW, and one failed because our one API resource has the caching strategy freshness and tries to get new data!

You can even inspect which data is currently cached by going to Application -> Cache Sorage:

ionic-pwa-cached-data
If you data is not present in here after your standard API calls, something with the URLs of your caching strategy is messed up, or the SW is out of sync and you should clear the site data and refresh the browser.

Keep in mind that we set a maxAge of 10 seconds for our one API resource, and therefore the data won’t be used after that time passed!

Netlify Ionic PWA hosting
So we are confident about our Ionic PWA and tested it locally, but now we want to see it on a real device! There are a lot of different ways like using Firebase hosting for your PWA, or using a service like Vercel.

To show you another way (which is very similar to Vercel) we will use Netlify in this tutorial to build and host the PWA.

Since Netlify needs to build our app in the end, we need to add another script to the scripts object of our package.json upfront:

"build:prod": "ng build --prod"
1
"build:prod": "ng build --prod"
This makes it easier to run a production build automatically.

Now we need a Git repository, and you can either use Github or Bitbucket for this.

Simply create a new repository in your account without any files, because we already got a Git repository locally through our Ionic project!

ionic-pwa-github-repo
Both Github and Bitbucket will show you commands to connect your existing repository with this new repo, and usually you just need to add your local files, commit them and then add a new origin and push the code:

git add .
git commit -am 'Initial commit.'

# Copy this from your repository!
git remote add origin https://github.com/saimon24/devdactic-pwa.git

git push -u origin master
1
2
3
4
5
6
7
git add .
git commit -am 'Initial commit.'
 
# Copy this from your repository!
git remote add origin https://github.com/saimon24/devdactic-pwa.git
 
git push -u origin master
Next time I’ll also use main instead of master, which is now the recommended terminus.

After your push your code should show up inside the repository, and you can start with Netlify by creating a new account.

Inside your account, click on New site from Git to start the wizard that will add your project. You will need to authorise Netlify to access your Github (Bitbucket) account and you can select the previously created project.
ionic-pwa-netlify-setup

The important part is now to configure the build correctly in the next step:

Build command: npw run build:prod
Publish directory: www
ionic-netlify-build-settings
Based on this information, Netlify can now pull in your code, run a production build (using the additional script we added to the package.json!) and host the output www folder to serve the PWA!

Once you deploy the site, you can see the log and finally get the URL to your deployment. I’ve hosted my PWA from this tutorial here!

Whenever you now push code, Netlify will run a new build of your app and update your PWA – what a great service.

Conclusion
Embracing the service worker inside your Ionic PWA and caching different resources and API endpoints can help to make your PWA work completely offline based on cached information.

Keep in mind that the service worker is only inside a PWA, so if you create a real native iOS or Android app from your code, you need a different caching approach as the service worker wont work in there like it does in our PWA.

On top services like Netlify and Vercel make it super easy these days to quickly build and host your Ionic PWA starting for free!

You can also find a video version of this tutorial below.
[top](#ionic-academy)
<!-- # anchor -->
# How to Build Your Own Ionic Library for NPM
Posted on December 15th, 2020

custom-ionic-library-npm
Tweet
Email
WhatsApp
Share
You find yourself creating custom components, pages and CRUD operations for your apps over and over? The solution might be to create your own Ionic library that you can install from NPM!

In this tutorial we will create an Angular library, use Ionic components and export our own functionality that allows us to even route to a whole page coming from the Ionic library!

ionic-library
At the same time we will include our Ionic library inside an Ionic testing app to see our changes in realtime, and finally publish the whole package to NPM so everyone can install it.

You can actually see my published devdactic-lib package right here!

Creating the Angular Library Project
The first step to your own custom Ionic library is to generate an Angular library. But this library needs to live inside a workspace, so we generate a new workspace without any application first and then generate the library and add two more components to it.

Go ahead and run:

# npm install -g @angular/cli
ng new devdacticWorkspace --create-application=false
cd ./devdacticWorkspace

ng generate library devdactic-lib --prefix=dev
ng g component customCard
ng g component customPage


ng build
cd dist/devdactic-lib
npm link
1
2
3
4
5
6
7
8
9
10
11
12
# npm install -g @angular/cli
ng new devdacticWorkspace --create-application=false
cd ./devdacticWorkspace
 
ng generate library devdactic-lib --prefix=dev
ng g component customCard
ng g component customPage
 
 
ng build
cd dist/devdactic-lib
npm link
After adding the components we run a first build which is necessary at least once to build the /dist folder!

Once the build is done, we can run the link command inside the folder. This command creates a symlink between your local node modules folder and this dist folder, which means you can easily add this folder to an Ionic project afterwards for testing and development.

When you now take a first look at this workspace, you will find the actual code for your library inside projects/devdactic.lib:

ionic-library-overview
This folder is where you build the functionalities of your Ionic library, add components and services, and declare everything correctly so we can import the module easily in other applications.

For development, I now recommend you run the build command with the watch flag, which is basically live reload for your component whenever something changes!

ng build --watch
1
ng build --watch
During development I sometimes had to restart this command or the Ionic serve, since some changes were not picked up correctly.

Testing the Ionic Library
Before we dive any further into the library, let’s simultanously create our Ionic app that uses our library.

Create a blank new project and install the package like it was already on NPM – it will directly pick up your local symlink instead:

ionic start devdacticLibraryApp blank --type=angular --capacitor
cd ./devdacticLibraryApp
npm link devdactic-lib
1
2
3
ionic start devdacticLibraryApp blank --type=angular --capacitor
cd ./devdacticLibraryApp
npm link devdactic-lib
You won’t see it inside your package.json file, but you should see a statement on the console which shows the path of your symlink.

There’s also a tiny issue with the Angular setup and symlinks, and in order to fix this you should now open your angular.json inside the Ionic project and add the preserveSymlinks entry at the shown path:

 "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "preserveSymlinks": true,
1
2
3
4
5
6
 "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "preserveSymlinks": true,
Now the compiler will be happy, and you can add the module as a little test to the src/app/home/home.module.ts like you are used to:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DevdacticLibModule } from 'devdactic-lib';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DevdacticLibModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
import { DevdacticLibModule } from 'devdactic-lib';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DevdacticLibModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
Since the library only exports the default generated component by now, we can not yet use our own components. But for testing, we can use the automatically created one inside the src/app/home/home.page.html like this:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Library
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
 <dev-devdactic-lib></dev-devdactic-lib>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Library
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 <dev-devdactic-lib></dev-devdactic-lib>
</ion-content>
It’s time to bring up ionic serve or Capacitor livereload on a device and check out the result:

If you see something like this, it means your Ionic library integration into the app with symlink works! If not, try to check the logs from both the library and your app, restart the commands and see if you missed something from above.

When you can see that your app and library are connected, it’s time to move on.

Adding Ionic to your Library
By now the library is merely an Angular library and doesn’t know about Ionic components at all. In order to use stuff like ion-card or ion-list inside the lib, we need to install Ionic as a development dependency:

cd projects/devdactic-lib
npm i @ionic/angular --save-dev
1
2
cd projects/devdactic-lib
npm i @ionic/angular --save-dev
You see that we navigate into the actual library folder first, because there’s also a package.json at the top of our workspace, but that’s the wrong place to install the depedency:

ionic-library-package-dependencies
We want to have it right inside the library, not at the top!

Also, the command for installing the dependency is not enough since we also need to add it as a peerDependencies inside the projects/devdactic-lib/package.json:

{
  "name": "devdactic-lib",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^9.1.12",
    "@angular/core": "^9.1.12",
    "@ionic/angular": "^5.5.0"
  },
  "dependencies": {
    "tslib": "^1.10.0"
  },
  "devDependencies": {
    "@ionic/angular": "^5.5.0"
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
{
  "name": "devdactic-lib",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^9.1.12",
    "@angular/core": "^9.1.12",
    "@ionic/angular": "^5.5.0"
  },
  "dependencies": {
    "tslib": "^1.10.0"
  },
  "devDependencies": {
    "@ionic/angular": "^5.5.0"
  }
}
Whenever someone uses our package, Angular will check if the peer dependencies are already installed in the parent project or otherwise install it, since the library now depends on it.

Now we are ready to add all the Ionic stuff into the library.

Preparing the Exports of your Library
You see that a lot of this isn’t working 100% with CLI commands yet, so you have to take some manual extra steps to make everything work.

Since apps from the outside using our package don’t know about the content automatically, we need to make sure that we are exporting everything correctly. Therefore, open the projects/devdactic-lib/src/public-api.ts and change it to:

/*
 * Public API Surface of devdactic-lib
 */

export * from './lib/devdactic-lib.service';
export * from './lib/devdactic-lib.component';
export * from './lib/devdactic-lib.module';
export * from './lib/custom-card/custom-card.component';
1
2
3
4
5
6
7
8
/*
 * Public API Surface of devdactic-lib
 */
 
export * from './lib/devdactic-lib.service';
export * from './lib/devdactic-lib.component';
export * from './lib/devdactic-lib.module';
export * from './lib/custom-card/custom-card.component';
We have only added our custom card, since we will handle the other page component a bit differently in the end.

Now it’s time to add everything to the main module of the library, but we also add something else:

You might have seen this with other packages that you include with a forRoot() call in your module, and that’s the behaviour we want to implement as well. To do so, we need to add a function to the main module of our library that exports some information and becomes a LibConfig object which is a simple interface that we define in there as well.

You could also pass more or other information to your library of course, we will simply pass a URL to it for now.

We as create an InjectionToken with our interface as this is not defined at runtime, we just need it do be injected into our module. We will also inject this LibConfigService in the next step inside a service to retrieve the actual value that was passed to our library!

Now change the projects/devdactic-lib/src/lib/devdactic-lib.module.ts to:

import { DevdacticLibService } from './devdactic-lib.service';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { DevdacticLibComponent } from './devdactic-lib.component';
import { CustomCardComponent } from './custom-card/custom-card.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

export interface LibConfig {
  apiUrl: string;
}
 
export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [DevdacticLibComponent, CustomCardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [DevdacticLibComponent, CustomCardComponent]
})
export class DevdacticLibModule {
  static forRoot(config: LibConfig): ModuleWithProviders {
    return {
      ngModule: DevdacticLibModule,
      providers: [
        DevdacticLibService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
import { DevdacticLibService } from './devdactic-lib.service';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { DevdacticLibComponent } from './devdactic-lib.component';
import { CustomCardComponent } from './custom-card/custom-card.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
 
export interface LibConfig {
  apiUrl: string;
}
 
export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');
 
@NgModule({
  declarations: [DevdacticLibComponent, CustomCardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [DevdacticLibComponent, CustomCardComponent]
})
export class DevdacticLibModule {
  static forRoot(config: LibConfig): ModuleWithProviders {
    return {
      ngModule: DevdacticLibModule,
      providers: [
        DevdacticLibService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  }
}
This setup might look a bit strange or difficult first, but it’s mandatory in order to feed some settings/values to our library later.

Using Ionic Components inside the Library
Now that we got the setup done we can start and add Ionic components inside our library.

To get started, simply change the projects/devdactic-lib/src/lib/custom-card/custom-card.component.html to this:

<ion-card>
    <ion-card-header>
        <ion-card-title>{{ title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
        {{ content }}
    </ion-card-content>
</ion-card>
1
2
3
4
5
6
7
8
<ion-card>
    <ion-card-header>
        <ion-card-title>{{ title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
        {{ content }}
    </ion-card-content>
</ion-card>
A simple card, but we will use dynamic values and so we define inputs for them just like we would when creating a shared component inside an Ionic app.

Therefore, open the according projects/devdactic-lib/src/lib/custom-card/custom-card.component.ts and change it to:

import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dev-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['./custom-card.component.css']
})
export class CustomCardComponent implements OnInit {
  @Input() title: string;
  @Input() content: string;

  constructor() { }

  ngOnInit(): void {
  }

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
 
@Component({
  selector: 'dev-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['./custom-card.component.css']
})
export class CustomCardComponent implements OnInit {
  @Input() title: string;
  @Input() content: string;
 
  constructor() { }
 
  ngOnInit(): void {
  }
 
}
That means, we can now use those inputs to bring values to the component, and since we already imported the module for our library inside our Ionic app before, we can now directly make use of our new component by adding the component inside the src/app/home/home.page.html of our testing app:

<dev-custom-card title="My Coold Library Card" content="There will be dragons"></dev-custom-card>
1
<dev-custom-card title="My Coold Library Card" content="There will be dragons"></dev-custom-card>
Serve the application, and you should see the card (coming from the library) filled with our own values!

ionic-library-initial-test
Using Services from our Ionic Library
This was just the start, now let’s continue with a service that we can directly import to our app. You could add all kind of useful stuff in here, in this example we will simply use the apiUrl of our LibConfig interface as the base URL to make an HTTP request.

In our previous example on building a WordPress library we made calls to the WP API based on the base url, which was even more helpful.

This time we will inject the base URL “https://randomuser.me/” in the next step, and since a call to that dummy api looks like “https://randomuser.me/api” we add the “api” part in our service.

Go ahead and change the projects/devdactic-lib/src/lib/devdactic-lib.service.ts to:

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LibConfigService, LibConfig } from './devdactic-lib.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DevdacticLibService {
  baseUrl = this.config.apiUrl;

  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) {
    console.log('My config: ', config);
  }

  getData() {
    return this.http.get<any>(`${this.baseUrl}/api`).pipe(
      map((res: any) => res.results[0])
    )
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LibConfigService, LibConfig } from './devdactic-lib.module';
import { map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class DevdacticLibService {
  baseUrl = this.config.apiUrl;
 
  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) {
    console.log('My config: ', config);
  }
 
  getData() {
    return this.http.get<any>(`${this.baseUrl}/api`).pipe(
      map((res: any) => res.results[0])
    )
  }
}
Now the service inside our library can make API calls based on a URL we pass to it, and we can pass it inside the forRoot() function right inside the src/app/app.module.ts of our Ionic testing app like this:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DevdacticLibModule } from 'devdactic-lib';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    DevdacticLibModule.forRoot({
      apiUrl: 'https://randomuser.me'
    })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
 
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DevdacticLibModule } from 'devdactic-lib';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    DevdacticLibModule.forRoot({
      apiUrl: 'https://randomuser.me'
    })],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
Your library starts to look like a real powerful package now!

To see the result of this, we can now inject the service into our src/app/home/home.page.ts just like we do with any other service:

import { Component } from '@angular/core';
import { DevdacticLibService } from 'devdactic-lib';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = null;

  constructor(private devdacticLibService: DevdacticLibService) { }

  getData() {
    this.devdacticLibService.getData().subscribe(res => {
      this.user = res;
    });
  }

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { Component } from '@angular/core';
import { DevdacticLibService } from 'devdactic-lib';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user = null;
 
  constructor(private devdacticLibService: DevdacticLibService) { }
 
  getData() {
    this.devdacticLibService.getData().subscribe(res => {
      this.user = res;
    });
  }
 
}
The only difference is that we are importing this service from our own Ionic library package instead now!

To finally show the value and call the function, quickly also change the src/app/home/home.page.html to:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Library
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <dev-custom-card title="My Coold Library Card" content="There will be dragons"></dev-custom-card>
  <ion-button expand="full" (click)="getData()">Load Data</ion-button>

  <ion-card *ngIf="user">
    <img [src]="user.picture.large">
    <ion-card-content>
      {{ user.email }}
    </ion-card-content>
  </ion-card>
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Devdactic Library
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content>
  <dev-custom-card title="My Coold Library Card" content="There will be dragons"></dev-custom-card>
  <ion-button expand="full" (click)="getData()">Load Data</ion-button>
 
  <ion-card *ngIf="user">
    <img [src]="user.picture.large">
    <ion-card-content>
      {{ user.email }}
    </ion-card-content>
  </ion-card>
</ion-content>
Alright, component and services from the Ionic library are working, now to the last missing piece.

Using Pages and CSS Variables from our Ionic Library
This was a question under the last version of this tutorial: How to include a page from the library?

An Ionic page is just like an Angular component, but usually Ionic pages come with their own routing and module to allow lazy loading, and we can do the same with our library now!

Therefore we first of all need to create a new file named custom-page-routing.module.ts inside our library within the custom page folder. Then, we can change the newly created projects/devdactic-lib/src/lib/custom-page/custom-page-routing.module.ts to look like inside a real Ionic app:

import { CustomPageComponent } from './custom-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CustomPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPageRoutingModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
import { CustomPageComponent } from './custom-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  {
    path: '',
    component: CustomPageComponent,
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPageRoutingModule {}
Additionally the page needs a module, so we create a new module at projects/devdactic-lib/src/lib/custom-page/custom-page.module.ts and insert:

import { CustomPageComponent } from './custom-page.component';
import { CustomPageRoutingModule } from './custom-page-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPageRoutingModule
  ],
  declarations: [CustomPageComponent]
})
export class CustomPageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
import { CustomPageComponent } from './custom-page.component';
import { CustomPageRoutingModule } from './custom-page-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomPageRoutingModule
  ],
  declarations: [CustomPageComponent]
})
export class CustomPageModule {}
The component is now basically like any other Ionic page that you generate, but we now need to export it a bit different inside the library.

To do so, open the projects/devdactic-lib/src/public-api.ts again and export the module instead of just the component this time:

export * from './lib/devdactic-lib.service';
export * from './lib/devdactic-lib.component';
export * from './lib/devdactic-lib.module';
export * from './lib/custom-card/custom-card.component';
export * from './lib/custom-page/custom-page.module';
1
2
3
4
5
export * from './lib/devdactic-lib.service';
export * from './lib/devdactic-lib.component';
export * from './lib/devdactic-lib.module';
export * from './lib/custom-card/custom-card.component';
export * from './lib/custom-page/custom-page.module';
Next step is to make the page look like an actual Ionic page, and to do so simply change the projects/devdactic-lib/src/lib/custom-page/custom-page.component.html to some Ionic markup of a page:

<ion-header>
    <ion-toolbar color="primary">
        <ion-buttons slot="start">
            <ion-back-button  defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title>
            Devdactic Lib Page
        </ion-title>
    </ion-toolbar>
</ion-header>

<ion-content>
    <div class="custom-box"></div>
    This is a full page from the library!
</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
<ion-header>
    <ion-toolbar color="primary">
        <ion-buttons slot="start">
            <ion-back-button  defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title>
            Devdactic Lib Page
        </ion-title>
    </ion-toolbar>
</ion-header>
 
<ion-content>
    <div class="custom-box"></div>
    This is a full page from the library!
</ion-content>
Since I also wanted to show how to inject some styling into your library, add the following snippet to the projects/devdactic-lib/src/lib/custom-page/custom-page.component.css:

.custom-box {
    background: var(--custom-background, #ff00ff);
    width: 100%;
    height: 100px;
}
1
2
3
4
5
.custom-box {
    background: var(--custom-background, #ff00ff);
    width: 100%;
    height: 100px;
}
Just like Ionic components, we can also define our own CSS variables that we could set from the outside to style the component! if the --custom-background is not set, the fallback value will be used instead.

Now we are ready to use the page inside our testing app, and we need a way to navigate to it.

As said before, we can now use lazy loading and don’t need to import the component directly (which would also work).

That means, we can use the standard Angular import() syntax with the only difference that we are importing the module from our Ionic library. Go ahead and open the src/app/app-routing.module.ts and insert a new route like this:

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'custom',
    loadChildren: () => import('devdactic-lib').then( m => m.CustomPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'custom',
    loadChildren: () => import('devdactic-lib').then( m => m.CustomPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
Don’t worry if you see compiler warnings at this point, in the end all will be fine. VSC wasn’t picking up the changes for me as well, but it still worked as expected afterwards..

Now we just need to navigate to the new route, so simply add a button with the new route to the src/app/home/home.page.html:

<ion-button expand="full" routerLink="/custom">Open Library Page</ion-button>
1
<ion-button expand="full" routerLink="/custom">Open Library Page</ion-button>
And don’t forget about the CSS!

We can style the block on that page right from our Ionic app by setting the CSS variable that we used in the library.

Since we don’t really have any connected styling file for the page, simply add it to the src/global.scss like this:

dev-custom-page {
    .custom-box {
        --custom-background: #1900ff;
    }
}
1
2
3
4
5
dev-custom-page {
    .custom-box {
        --custom-background: #1900ff;
    }
}
Now we can navigate to a whole page that’s defined inside our Ionic library and even pass custom styling to it if we want to!

ionic-library-custom-page
Publishing your Ionic Library to NPM
If at some point you want to make the library public or just don’t want to use the local symlink anymore, you can easily distribute the library.

Simply run a build, navigate into the output folder and publish it to npm like this:

ng build --prod
cd dist/devdactic-lib
npm publish
1
2
3
ng build --prod
cd dist/devdactic-lib
npm publish
I did so as well, and you can see the devdactic-lib inside the npm package registry. If you used the same name you can’t publish it of course, pick your own library name instead then!

Now installing your new Ionic library is as easy as running:

npm i devdactic-lib
1
npm i devdactic-lib
The usage inside your testing app doesn’t change since we used the symlink correctly and it now just switches over to the real files downloaded from npm.

Conclusion
Creating your own Ionic library is a powerful way to build a set of functionality for your company or client that you can reuse across your apps.

Define your own custom element or tweak Ionic components to your needs, or even create wrapper libraries for your APIs to reuse them in different projects.

You can also find a video version of this tutorial below

[top](#ionic-academy)
# anchor
# 
(top)[#ionic-academy]
# Torah Notes

Hebrew years have 352-380 days. start there next year

## Torah
1. Genesis
2. Exodus
3. Leviticus
4. Numbers
5. Deuteronomy

## Nevi'im (Prophets)
6. Joshua 24
7. Judges 21
8. Samuel 31 + 24
9. Kings 22 + 25
10. Isaiah 66
11. Jeremiah 52
12. Ezekiel 48
13. Hosea 14
14. Joel 3
15. Amos 9
16. Obadiah 1
17. Jonah 4
18. Micah 7
19. Nahum 3
20. Habakkuk 3
21. Zephaniah 3
22. Haggai 2
23. Zechariah 14
24. Malachi 4

380 Chapters
- 4 Jonah read  on Yom Kippur
- 1 Haggai read as one sometimes
- 3 Malachi read as one sometimes
- 3 Habakkuk read on holiday Shavuot (second day)
- 7 Micah to read on Yom Kippur after Jonah
- 9 Amos Read on holiday (temple descruction day? Shoah rememberence day, israel independence day?)
- 1 obadiah read for haftarah of vayishlach

## Ketuvim (Writings)
25. Psalms 150
26. Proverbs 31
27. Job 42
28. Song of Songs 8
29. Ruth 4
31. Lamentations 5
30. Ecclesiastes 12
32. Esther 10
33. Daniel 12
34. Ezra 10
35. Nehemiah 13
36. Chronicles 29 + 36

362 chapters

just do a chapter a day minus Esther 
- 9 Esther read on Purim
- 3 Ruth read on Shavuot
- 7 Song of Songs during passover
- 4 Lamentations on 9 of Av

## Brit Chadashah (New Testament)
37. Matthew 28
38. Mark 16
39. Luke 24
40. John 21
41. Acts 28
42. Romans 16
43. I Corinthians 16
44. II Corinthians 13
45. Galatians 6
46. Ephesians 6
47. Philippians 4
48. Colossians 4
49. I Thessalonians 5
50. II Thessalonians 3
51. I Timothy 6
52. II Timothy 4
53. Titus 3
54. Philemon 1
55. Hebrews 13
56. James 5
57. I Peter 5
58. II Peter 3
59. I John 5
60. II John 1
61. III John 1
62. Jude 1
63. Revelation 22

260 chapters

5 chapters per week

(top)[#ionic-academy]

# Jewish Holidays

## Rosh Hashanah
- 1 Tishrei
- 2 Tishrei

## Days of Awe
- 1 Tishrei
- 2 Tishrei
- 3 Tishrei
- 4 Tishrei
- 5 Tishrei
- 6 Tishrei
- 7 Tishrei
- 8 Tishrei
- 9 Tishrei

## Yom Kippur
- 10 Tishrei

## Sukkot
- 15 Tishrei

## Shemini Atzeret
- 22 Tishrei

## Simchat Torah
- 22 Tishrei

## Chanukah
- 25 Kislev

## Purim
- 14 Adar

## Pesach
- 15 Nisan

## Shavuot
- 6 Sivan

## Tisha B'Av
- 9 Av

## Tu B'Shevat
- 15 Shevat

## Lag B'Omer
- 18 Iyar

## Yom HaShoah
- 27 Nisan

## Yom HaZikaron
- 4 Iyar

## Yom HaAtzmaut
- 5 Iyar

## Yom Yerushalayim
- 28 Iyar




[top](#ionic-academy)

Genesis 2:1-5
King James Version
Thus the heavens and the earth were finished, and all the host of them.

And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.

And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.

These are the generations of the heavens and of the earth when they were created, in the day that the Lord God made the earth and the heavens,

And every plant of the field before it was in the earth, and every herb of the field before it grew: for the Lord God had not caused it to rain upon the earth, and there was not a man to till the ground.

Matthew 3-4
King James Version
In those days came John the Baptist, preaching in the wilderness of Judaea,

And saying, Repent ye: for the kingdom of heaven is at hand.

For this is he that was spoken of by the prophet Esaias, saying, The voice of one crying in the wilderness, Prepare ye the way of the Lord, make his paths straight.

And the same John had his raiment of camel's hair, and a leathern girdle about his loins; and his meat was locusts and wild honey.

Then went out to him Jerusalem, and all Judaea, and all the region round about Jordan,

And were baptized of him in Jordan, confessing their sins.

But when he saw many of the Pharisees and Sadducees come to his baptism, he said unto them, O generation of vipers, who hath warned you to flee from the wrath to come?

Bring forth therefore fruits meet for repentance:

And think not to say within yourselves, We have Abraham to our father: for I say unto you, that God is able of these stones to raise up children unto Abraham.

And now also the axe is laid unto the root of the trees: therefore every tree which bringeth not forth good fruit is hewn down, and cast into the fire.

I indeed baptize you with water unto repentance. but he that cometh after me is mightier than I, whose shoes I am not worthy to bear: he shall baptize you with the Holy Ghost, and with fire:

Whose fan is in his hand, and he will throughly purge his floor, and gather his wheat into the garner; but he will burn up the chaff with unquenchable fire.

Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him.

But John forbad him, saying, I have need to be baptized of thee, and comest thou to me?

And Jesus answering said unto him, Suffer it to be so now: for thus it becometh us to fulfil all righteousness. Then he suffered him.

And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:

And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.

Then was Jesus led up of the Spirit into the wilderness to be tempted of the devil.

And when he had fasted forty days and forty nights, he was afterward an hungred.

And when the tempter came to him, he said, If thou be the Son of God, command that these stones be made bread.

But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.

Then the devil taketh him up into the holy city, and setteth him on a pinnacle of the temple,

And saith unto him, If thou be the Son of God, cast thyself down: for it is written, He shall give his angels charge concerning thee: and in their hands they shall bear thee up, lest at any time thou dash thy foot against a stone.

Jesus said unto him, It is written again, Thou shalt not tempt the Lord thy God.

Again, the devil taketh him up into an exceeding high mountain, and sheweth him all the kingdoms of the world, and the glory of them;

And saith unto him, All these things will I give thee, if thou wilt fall down and worship me.

Then saith Jesus unto him, Get thee hence, Satan: for it is written, Thou shalt worship the Lord thy God, and him only shalt thou serve.

Then the devil leaveth him, and, behold, angels came and ministered unto him.

Now when Jesus had heard that John was cast into prison, he departed into Galilee;

And leaving Nazareth, he came and dwelt in Capernaum, which is upon the sea coast, in the borders of Zabulon and Nephthalim:

That it might be fulfilled which was spoken by Esaias the prophet, saying,

The land of Zabulon, and the land of Nephthalim, by the way of the sea, beyond Jordan, Galilee of the Gentiles;

The people which sat in darkness saw great light; and to them which sat in the region and shadow of death light is sprung up.

From that time Jesus began to preach, and to say, Repent: for the kingdom of heaven is at hand.

And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers.

And he saith unto them, Follow me, and I will make you fishers of men.

And they straightway left their nets, and followed him.

And going on from thence, he saw other two brethren, James the son of Zebedee, and John his brother, in a ship with Zebedee their father, mending their nets; and he called them.

And they immediately left the ship and their father, and followed him.

And Jesus went about all Galilee, teaching in their synagogues, and preaching the gospel of the kingdom, and healing all manner of sickness and all manner of disease among the people.

And his fame went throughout all Syria: and they brought unto him all sick people that were taken with divers diseases and torments, and those which were possessed with devils, and those which were lunatick, and those that had the palsy; and he healed them.

And there followed him great multitudes of people from Galilee, and from Decapolis, and from Jerusalem, and from Judaea, and from beyond Jordan.




Building an Ionic Parallax Image Effect [v5]
Posted on October 27th, 2020

ionic-parallax-image-effect
Tweet
Email
WhatsApp
Share
By adding the Ionic Parallax image effect to your images, you can tremendously spice up otherwise static and boring pages and create a great UI effect within minutes!

The idea behind the Ionic Parallax image scroll is to move an image out of the view slower than the actual content, which makes it feel like the content is scrolling above the image.

ionic-parallax-image-effect
We can achieve this behaviour with a simple directive and manipulating the image based on scroll events, so let’s do it!

Starting the Ionic Parallax Image App
We start inside a blank Ionic app and add a new module which holds the directives. This setup is usually the best way for any kind of custom components:

ionic start academyParallax blank --type=angular --capacitor
cd ./academyParallax
ionic g module directives/sharedDirectives --flat
ionic g directive directives/parallaxHeader
1
2
3
4
ionic start academyParallax blank --type=angular --capacitor
cd ./academyParallax
ionic g module directives/sharedDirectives --flat
ionic g directive directives/parallaxHeader
Now we need to prepare the shared module in order to declare (should have happened automatically when you run the commands in the above order) and export it so other modules can import it.

Therefore go ahead and change the src/app/directives/shared-directives.module.ts to:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxHeaderDirective } from './parallax-header.directive';

@NgModule({
  declarations: [ParallaxHeaderDirective],
  imports: [
    CommonModule
  ],
  exports: [ParallaxHeaderDirective]
})
export class SharedDirectivesModule { }
1
2
3
4
5
6
7
8
9
10
11
12
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxHeaderDirective } from './parallax-header.directive';
 
@NgModule({
  declarations: [ParallaxHeaderDirective],
  imports: [
    CommonModule
  ],
  exports: [ParallaxHeaderDirective]
})
export class SharedDirectivesModule { }
Now we also need to import this new module in the page where we plan to add the Ionic Parallax image, so simply open the src/app/home/home.module.ts and change it to:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
 
import { HomePageRoutingModule } from './home-routing.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
Whenever you want to use the directive in another page, simply add the module in there as well!

Preparing the Content View
Now we are finally able to use the parallax directive on our page. But first, we need an image. And to make this a bit more dynamic, let’s define the image from code.

Normally you might receive the image from your API, so this approach should then work best for you. Let’s define a dummy image inside the src/app/home/home.page.ts:

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Useful if you get image URL from an API
  // or in general want to make it dynamic
  myImagePath = 'https://images.unsplash.com/photo-1601652290498-0b5f418541a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80';

  constructor() {}

}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
import { Component } from '@angular/core';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Useful if you get image URL from an API
  // or in general want to make it dynamic
  myImagePath = 'https://images.unsplash.com/photo-1601652290498-0b5f418541a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80';
 
  constructor() {}
 
}
Now we can use this image inside the according template of that page.

Here we need to change the structure of the page a bit to make it match what our directive needs in the end, which means setting scrollEvents of the ion-content to true.

We need to wrap all of our main content into a div with the class main, then we put our image div above with the class parallax-image. The directive will later look exactly for these classes!

The Parallax image is styled through CSS, but we can now make use of the previously defined image URL so everything is more dynamic.

Go ahead and also fill the main area with some dummy content, like I did below inside the src/app/home/home.page.html:

<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Parallax
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content appParallaxHeader [scrollEvents]="true">

  <!-- Your background image -->
  <div class="parallax-image" [style.background-image]="'url(' + myImagePath + ')'"></div>

  <div class="main">
    <!-- Dummy content -->
    <ion-list>
      <ion-item *ngFor="let i of [].constructor(30)">
        Dummy Entry
      </ion-item>
    </ion-list>
  </div>

</ion-content>
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Academy Parallax
    </ion-title>
  </ion-toolbar>
</ion-header>
 
<ion-content appParallaxHeader [scrollEvents]="true">
 
  <!-- Your background image -->
  <div class="parallax-image" [style.background-image]="'url(' + myImagePath + ')'"></div>
 
  <div class="main">
    <!-- Dummy content -->
    <ion-list>
      <ion-item *ngFor="let i of [].constructor(30)">
        Dummy Entry
      </ion-item>
    </ion-list>
  </div>
 
</ion-content>
We don’t see the image yet as we still need to define the size as it’s simply the background image of the box, so also add this to the src/app/home/home.page.scss:

.parallax-image {
    background-repeat: no-repeat;
    background-position: center; 
    background-size: cover;
    height: 30vh;
}
 
.main {
    background-color: white;
    width: 100%;
    position: absolute;
}
1
2
3
4
5
6
7
8
9
10
11
12
.parallax-image {
    background-repeat: no-repeat;
    background-position: center; 
    background-size: cover;
    height: 30vh;
}
 
.main {
    background-color: white;
    width: 100%;
    position: absolute;
}
Now the directive is applied (which doesn’t do anything right now) and we have a dummy list that we can scroll – now on to the directive!

Creating the Ionic Parallax Image Directive
The general idea behind the Parallax effect is to move out a specific area of your view (in our case an image) with a different speed than the rest of the actual content. By having the content above the image, it looks like it is floating above the image with a different speed.

To do so, we need to hook into the scroll events of the content area, and the directive needs to access the different DOM elements accessed through parallax-image and main in order to change them on every scroll event that occurs.

We can simply listen to the scroll events by using the @HostListener directive, but before we get into this we need to find out the height of the image in the init block!

Here we grab the reference to the image object and access the height, and to make our animation more performant you should perform this kind of things with the Ionic DomController.

This controller basically helps to schedule a read/write to the best time and not IMMEDIATELY, so your animations perform a lot better in general!

Whenever we scroll the content, we now grab the different scrolled from the top and calculate the change which we store inside moveImage.

The else block in there is usually only triggered if you scroll more to the top on iOS and reach negative values, in which case you can scale the image a bit up to achieve an even better result of the parallax effect!

Now go ahead and change the src/app/directives/parallax-header.directive.ts to:

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appParallaxHeader]'
})
export class ParallaxHeaderDirective {
  header: any;
  headerHeight: number;
  moveImage: number;
  scaleImage: number;

  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {}

  ngOnInit() {
    let content = this.element.nativeElement;
    this.header = content.getElementsByClassName('parallax-image')[0];

    this.domCtrl.read(() => {
      this.headerHeight = this.header.clientHeight;
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    const scrollTop = $event.detail.scrollTop;

    this.domCtrl.write(() => {
      if (scrollTop > 0) {
        // Use higher values to move the image out faster
        // Use lower values to move it out slower
        this.moveImage = scrollTop / 2;
        this.scaleImage = 1;
      } else {
        // +1 at the end as the other part can become 0
        // and the image would disappear
        this.scaleImage = -scrollTop / this.headerHeight + 1;
        this.moveImage = scrollTop / 1.4;
      }

      this.renderer.setStyle(this.header,'webkitTransform',
        'translate3d(0,' + this.moveImage + 'px,0) scale(' + this.scaleImage + ',' + this.scaleImage +')'
      );
    });
  }
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
 
@Directive({
  selector: '[appParallaxHeader]'
})
export class ParallaxHeaderDirective {
  header: any;
  headerHeight: number;
  moveImage: number;
  scaleImage: number;
 
  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {}
 
  ngOnInit() {
    let content = this.element.nativeElement;
    this.header = content.getElementsByClassName('parallax-image')[0];
 
    this.domCtrl.read(() => {
      this.headerHeight = this.header.clientHeight;
    });
  }
 
  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    const scrollTop = $event.detail.scrollTop;
 
    this.domCtrl.write(() => {
      if (scrollTop > 0) {
        // Use higher values to move the image out faster
        // Use lower values to move it out slower
        this.moveImage = scrollTop / 2;
        this.scaleImage = 1;
      } else {
        // +1 at the end as the other part can become 0
        // and the image would disappear
        this.scaleImage = -scrollTop / this.headerHeight + 1;
        this.moveImage = scrollTop / 1.4;
      }
 
      this.renderer.setStyle(this.header,'webkitTransform',
        'translate3d(0,' + this.moveImage + 'px,0) scale(' + this.scaleImage + ',' + this.scaleImage +')'
      );
    });
  }
}
After the calculation for the new values is done we schedule the change of our header object (the image) inside the DomController and both move and scale the image at the same time.

As a result, the image now scrolls out at half the speed of the content which results in our nice Ionic Parallax image effect!

Conclusion
You can play around a bit more with the different values if you want to scroll the image (or in general div element) faster/slower or add more scale, fade or anything you want in there.

Hooking into the Ionic scroll events with a directive never felt easier!

