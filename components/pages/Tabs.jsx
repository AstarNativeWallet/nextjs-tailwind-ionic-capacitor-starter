import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cog, flash, list } from 'ionicons/icons';

import Home from './Feed';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Web3AuthLogin from './Web3AuthLogin';
import Web3AuthMpc from './Web3AuthMpc';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/feed" render={() => <Home />} exact={true} />
        <Route path="/tabs/lists" render={() => <Lists />} exact={true} />
        <Route
          path="/tabs/lists/:listId"
          render={() => <ListDetail match={undefined} />}
          exact={true}
        />
        <Route path="/tabs/settings" render={() => <Settings />} exact={true} />
        <Route path="/tabs/login" render={() => <Web3AuthLogin />} exact={true} />
        <Route path="/tabs/mpc" render={() => <Web3AuthMpc />} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/feed" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/feed">
          <IonIcon icon={flash} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/lists">
          <IonIcon icon={list} />
          <IonLabel>Lists</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/login">
          <IonIcon icon={cog} />
          <IonLabel>Login</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" href="/tabs/mpc">
          <IonIcon icon={cog} />
          <IonLabel>MPC</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
