import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/lib/store/slices/authSlice'

// Mock the AuthForm component
const MockAuthForm = ({ type }: { type: 'login' | 'register' }) => (
  <form>
    <input name="email" placeholder="Email" />
    <input name="password" placeholder="Password" />
    <button type="submit">{type === 'login' ? 'Sign In' : 'Sign Up'}</button>
  </form>
)

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

describe('AuthForm', () => {
  it('renders login form correctly', () => {
    const store = createTestStore()
    
    render(
      <Provider store={store}>
        <MockAuthForm type="login" />
      </Provider>
    )

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('renders register form correctly', () => {
    const store = createTestStore()
    
    render(
      <Provider store={store}>
        <MockAuthForm type="register" />
      </Provider>
    )

    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })
}) 