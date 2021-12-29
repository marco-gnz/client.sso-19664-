export default function ({ store, redirect }) {
  console.log(store.state.auth.loggedIn);
  // If the user is not authenticated
  if (!store.state.auth.loggedIn) {
    return redirect('/login')
  }
}
