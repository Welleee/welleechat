import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LoginComponent from "./components/Login/Login";
import ChatContainer from "./containers/ChatContainer";
import { AuthContext } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { UiProvider } from "./context/uiContex";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <div id="chat-container">
        <UiProvider>
          <AuthContext>
            <ChatProvider>
              <Router>
                <Switch>
                  <LoginComponent exact path="/" />
                  <Route exact path="/chats">
                    <ChatContainer />
                  </Route>
                </Switch>
              </Router>
            </ChatProvider>
          </AuthContext>
        </UiProvider>
      </div>
    </div>
  );
}

export default App;
