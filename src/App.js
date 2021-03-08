import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LoginComponent from "./components/Login/Login";
import SignUpComponent from "./components/Login/SignUp";
import ChatContainer from "./containers/ChatContainer";
import { AuthContext } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { UiProvider } from "./context/uiContex";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <UiProvider>
        <AuthContext>
          <ChatProvider>
            <Router>
              <Switch>
                <LoginComponent exact path="/" />
                <SignUpComponent exact path="/signup" />
                <Route exact path="/chats">
                  <div id="chat-container">
                    <ChatContainer />
                  </div>
                </Route>
              </Switch>
            </Router>
          </ChatProvider>
        </AuthContext>
      </UiProvider>
    </div>
  );
}

export default App;
