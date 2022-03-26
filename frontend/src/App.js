import '@fontsource/roboto';
import './styles/css/App.css';
import './styles/css/Common.css';
import './styles/css/Popup.css';
import './styles/css/Login.css';
import './styles/css/Admin.css';
import './styles/css/User.css';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import WOW from 'wowjs';

import Login from './components/Admin/Login';
import Admin from './components/Admin/Admin';
import User from './components/User/User';
import DataTable from './components/Common/DataTable';

function ProtectedRoute({ component: Component, ...rest }) {

  return (<Route {...rest} render={(props) => {

    return sessionStorage.jwtToken ? 
            (<Component {...props} />) 
            : 
            (<Redirect to='/login' />);
  }} />)
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function NewComp() {
  // const rows = [
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Donut', 452, 25.0, 51, 4.9),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  //   createData('Honeycomb', 408, 3.2, 87, 6.5),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Jelly Bean', 375, 0.0, 94, 0.0),
  //   createData('KitKat', 518, 26.0, 65, 7.0),
  //   createData('Lollipop', 392, 0.2, 98, 0.0),
  //   createData('Marshmallow', 318, 0, 81, 2.0),
  //   createData('Nougat', 360, 19.0, 9, 37.0),
  //   createData('Oreo', 437, 18.0, 63, 4.0),,
  //   createData('Divesh', 437, 18.0, 63, 4.0),
  // ];

  // const headCells = [
  //   { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  //   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  //   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  //   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  //   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
  // ];

  const rows = [
    {exm1: 'a1', exm2: 'a2', exm3: 1},
    {exm1: 'b1', exm2: 'b2', exm3: 2},
    {exm1: 'c1', exm2: 'c2', exm3: 3}
  ];

  const columns = [
    {id: 'exm1', label: 'example 1'},
    {id: 'exm2', label: 'example 2', align:"center"},
    {id: 'exm3', label: 'example 3', align:"right"}
  ];

  return (<DataTable title="Example Table" rows={rows} columns={columns} />);
}

function App() {
  useEffect(function(){
    new WOW.WOW({
        live: true
    }).init();
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/admin" exact={true} component={Admin} />
        <Route path="/login" exact={true} component={Login} />
        <Route path="/" exact={true} component={User} />
        {/* <Route path="/example" exact={true} component={NewComp} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
