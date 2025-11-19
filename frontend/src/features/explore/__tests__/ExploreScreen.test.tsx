import { render } from '@testing-library/react-native';
import { ExploreScreen } from '../ExploreScreen';

describe('ExploreScreen', () => {
  it('renders mock spots', () => {
    const { getByText } = render(<ExploreScreen />);
    expect(getByText(/Explore/i)).toBeTruthy();
    expect(getByText('Skyline Rooftop')).toBeTruthy();
  });
});

