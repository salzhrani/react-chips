/* eslint-disable prettier/prettier */
import React, {
  ChangeEvent,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import Autosuggest from 'react-autosuggest';
import useThrottle from 'react-use/lib/useThrottle';
import { Chip } from './Chip';

export interface Props<T = string> {
  value: Array<T>;
  onChange?: (chips: Array<T>) => void;
  placeholder?: string;
  // theme: PropTypes.object;
  // chipTheme: PropTypes.object;
  suggestions?: Array<T>;
  fetchSuggestions?: (value: any) => Promise<Array<T>>;
  fetchSuggestionsThrushold?: number;
  fromSuggestionsOnly?: boolean;
  uniqueChips?: boolean;
  renderChip?: (chip: T) => ReactElement;
  suggestionsFilter?: (chip: T, value: T) => boolean;
  getChipValue?: (chip: T) => T;
  createChipKeys?: number[];
  getSuggestionValue?: (suggestion: T) => T;
  renderSuggestion?: (suggestion: T) => ReactElement;
  shouldRenderSuggestions?: (suggestion: T) => boolean;
  alwaysRenderSuggestions?: boolean;
  highlightFirstSuggestion?: boolean;
  focusInputOnSuggestionClick?: boolean;
  multiSection?: boolean;
  renderSectionTitle?: (section: any) => ReactNode;
  renderLoading?: () => ReactNode;
  getSectionSuggestions?: (section: any) => T[];
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556

const renderChip_ = (value: ReactNode) => <Chip>{value}</Chip>;

export const Chips: FC<Props> = ({
  value,
  renderChip = renderChip_,
  onChange,
  uniqueChips,
  suggestions = [],
  fetchSuggestions,
  suggestionsFilter,
  fetchSuggestionsThrushold = 100,
  getChipValue,
  getSuggestionValue,
  placeholder,
  fromSuggestionsOnly,
  createChipKeys,
  renderSuggestion,
  renderLoading,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [chipSelected, setChipSelected] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const ref = useRef<null | HTMLDivElement>(null);
  const throttledValue = useThrottle(currentValue, fetchSuggestionsThrushold);

  const filterUniqueChips = useCallback(
    (suggestions: string[]) => {
      return suggestions.filter(
        (suggestion) =>
          !value.some(
            (chip) => getChipValue!(chip) === getSuggestionValue!(suggestion)
          )
      );
    },
    [getChipValue, getSuggestionValue, value]
  );

  useEffect(() => {
    let unmounted = false;
    (async () => {
      if (throttledValue !== '' && fetchSuggestions != null) {
        if (unmounted) return;
        const fetchedSuggestions = await fetchSuggestions(throttledValue);
        if (unmounted) return;
        setLoading(false);
        setCurrentSuggestions(
          uniqueChips ? filterUniqueChips(fetchedSuggestions) : fetchedSuggestions
        );
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [fetchSuggestions, filterUniqueChips, throttledValue, uniqueChips]);

  const removeChip = useCallback(
    (idx: number) => {
      let left = value.slice(0, idx);
      let right = value.slice(idx + 1);
      const nextChips = [...left, ...right];
      onChange?.(nextChips);
    },
    [value, onChange]
  );

  const renderChips = useMemo(() => {
    return value.map((chip, idx) => {
      return React.cloneElement(renderChip(chip), {
        selected: chipSelected && idx === value.length - 1,
        onRemove: () => removeChip(idx),
        index: idx,
        key: `chip${idx}`,
      });
    });
  }, [chipSelected, removeChip, renderChip, value]);

  const onSuggestionsFetchRequested = useCallback(
    ({ value }) => {
      if (fetchSuggestions) {
        setLoading(true);
        setCurrentValue(value);
      } else {
        setCurrentSuggestions(
          (uniqueChips
            ? filterUniqueChips(suggestions)
            : suggestions
          ).filter((opts) => suggestionsFilter!(opts, value))
        );
      }
    },
    [fetchSuggestions, filterUniqueChips, suggestions, suggestionsFilter, uniqueChips]
  );
  const onSuggestionsClearRequested = useCallback(() => {
    setCurrentSuggestions([]);
  }, []);

  const addChip = useCallback(
    (newValue) => {
      if (uniqueChips && value.indexOf(newValue) !== -1) {
        setCurrentValue('');
        return;
      }
      let chips = [...value, newValue];
      onChange?.(chips);
      setCurrentValue('');
    },
    [onChange, uniqueChips, value]
  );

  const onChangeCB = useCallback(
    (_: ChangeEvent, { newValue }: { newValue: string }) => {
      if (
        !fromSuggestionsOnly &&
        newValue.indexOf(',') !== -1 &&
        createChipKeys != null &&
        createChipKeys.includes(9)
      ) {
        let chips = newValue
          .split(',')
          .map((val) => val.trim())
          .filter((val) => val !== '');
        chips.forEach((chip) => {
          addChip(chip);
        });
      } else {
        setCurrentValue(newValue);
      }
    },
    [addChip, createChipKeys, fromSuggestionsOnly]
  );

  const lastEvent = useRef<KeyboardEvent | null>(null);

  const onBackspace = useCallback(() => {
    if (currentValue === '' && value.length > 0) {
      if (chipSelected) {
        const nextChips = value.slice(0, -1);
        setChipSelected(true);
        setChips(chips);
        onChange?.(nextChips);
      } else {
        setChipSelected(true);
      }
    }
  }, [chipSelected, chips, currentValue, onChange, value]);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.keyCode === 13 && lastEvent.current === e) {
        lastEvent.current = null;
        return;
      }
      if (
        !fromSuggestionsOnly &&
        createChipKeys != null &&
        // @ts-expect-error
        (createChipKeys.includes(e.keyCode) || createChipKeys.includes(e.key))
      ) {
        e.preventDefault();
        if (currentValue.trim()) addChip(currentValue);
      }
      if (e.keyCode === 8) {
        onBackspace();
      } else if (chipSelected) {
        setChipSelected(false);
      }
    },
    [
      addChip,
      chipSelected,
      createChipKeys,
      currentValue,
      fromSuggestionsOnly,
      onBackspace,
    ]
  );

  const onBlur = useCallback(() => {
    ref.current?.focus();
  }, []);

  const onFocus = useCallback(() => {
    ref.current?.blur();
  }, []);

  const inputProps = useMemo(
    () => ({
      placeholder,
      value: currentValue,
      onChange: onChangeCB,
      onKeyDown: handleKeyDown,
      onBlur: onBlur,
      onFocus: onFocus,
    }),
    [currentValue, handleKeyDown, onBlur, onChangeCB, onFocus, placeholder]
  );
  const onSuggestionSelected = useCallback(
    (e, { suggestion }) => {
      lastEvent.current = e;
      addChip(suggestion);
      setCurrentValue('');
    },
    [addChip]
  );

  return (
    <div className="react-chips" ref={ref}>
      {renderChips}
      <Autosuggest
      {...rest}
        suggestions={currentSuggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={() => currentValue}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestion={renderSuggestion!}
      />
      {loading ? renderLoading?.() : null}
    </div>
  );
};

Chips.defaultProps = {
  getSuggestionValue: (s) => s,
  value: [],
  onChange: () => {},
  renderChip: renderChip_,
  renderLoading: () => <span>Loading...</span>,
  renderSuggestion: (suggestion: string) => <span>{suggestion}</span>,
  suggestionsFilter: (opt, val) =>
    opt.toLowerCase().indexOf(val.toLowerCase()) !== -1,
  getChipValue: (item) => item,
  createChipKeys: [9],
};
