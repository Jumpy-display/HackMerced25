import logo from './logo.svg';
import './App.css';
import { DataProvider } from "./DataContext";
import AddressForm from "./AddressForm";

function App() {
  return (
    <DataProvider>
    <div className="App">
      <AddressForm />
    </div>
    </DataProvider>
  );
}

export default App;