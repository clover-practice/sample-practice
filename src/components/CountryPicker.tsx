import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import countries from '../data/countries';
import Colors from '../constants/colors';

type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

type Props = {
  selected: Country;
  onSelect: (country: Country) => void;
};

const CountryPicker: React.FC<Props> = ({ selected, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

//   const filtered = countries.filter((c) =>
//     c.name.toLowerCase().includes(query.toLowerCase())
//   );

    
    
    const filtered = countries
  .filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

    
  return (
    <>
      <TouchableOpacity
        style={styles.selectedContainer}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.flag}>{selected.flag}</Text>
        <Text style={styles.dialCode}>{selected.dialCode}</Text>
      </TouchableOpacity>
   <Modal visible={visible} animationType="slide" transparent>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContent}>
      <TextInput
        style={styles.search}
        placeholder="Search country..."
        value={query}
        onChangeText={setQuery} 
      />
      
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.countryRow}
            onPress={() => {
              onSelect(item);
              setVisible(false);
            }}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.dialCode}>{item.dialCode}</Text>
          </TouchableOpacity>
        )}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      />

      <TouchableOpacity onPress={() => setVisible(false)}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flag: {
    fontSize: 22,
    marginRight: 4,
  },
  dialCode: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '60%',
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  search: {
    backgroundColor: Colors.GRAY_LIGHT,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  name: {
    flex: 1,
    marginLeft: 10,
  },
  cancel: {
    color: Colors.ERROR,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 16,
  },
});

export default CountryPicker;


 


// By Grounpin==================================
// import React, { useState, useMemo } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   SectionList,
//   StyleSheet,
// } from 'react-native';
// import countries from '../data/countries';
// import Colors from '../constants/colors';

// type Country = {
//   name: string;
//   code: string;
//   dialCode: string;
//   flag: string;
// };

// type Props = {
//   selected: Country;
//   onSelect: (country: Country) => void;
// };

// const CountryPicker: React.FC<Props> = ({ selected, onSelect }) => {
//   const [visible, setVisible] = useState(false);
//   const [query, setQuery] = useState('');

//   const filteredCountries = useMemo(() => {
//     const filtered = countries.filter((c) =>
//       c.name.toLowerCase().includes(query.toLowerCase())
//     );
//     const grouped: { [key: string]: Country[] } = {};

//     filtered.forEach((country) => {
//       const letter = country.name[0].toUpperCase();
//       if (!grouped[letter]) grouped[letter] = [];
//       grouped[letter].push(country);
//     });

//     const sections = Object.keys(grouped)
//       .sort()
//       .map((letter) => ({
//         title: letter,
//         data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
//       }));

//     return sections;
//   }, [query]);

//   return (
//     <>
//       <TouchableOpacity
//         style={styles.selectedContainer}
//         onPress={() => setVisible(true)}
//       >
//         <Text style={styles.flag}>{selected.flag}</Text>
//         <Text style={styles.dialCode}>{selected.dialCode}</Text>
//       </TouchableOpacity>

//       <Modal visible={visible} animationType="slide" transparent>
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalContent}>
//             <TextInput
//               style={styles.search}
//               placeholder="Search country..."
//               value={query}
//               onChangeText={setQuery}
//             />

//             <SectionList
//               sections={filteredCountries}
//               keyExtractor={(item) => item.code}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.countryRow}
//                   onPress={() => {
//                     onSelect(item);
//                     setVisible(false);
//                   }}
//                 >
//                   <Text style={styles.flag}>{item.flag}</Text>
//                   <Text style={styles.name}>{item.name}</Text>
//                   <Text style={styles.dialCode}>{item.dialCode}</Text>
//                 </TouchableOpacity>
//               )}
//               renderSectionHeader={({ section: { title } }) => (
//                 <Text style={styles.sectionHeader}>{title}</Text>
//               )}
//               stickySectionHeadersEnabled
//               keyboardShouldPersistTaps="handled"
//               contentContainerStyle={{ paddingBottom: 20 }}
//             />

//             <TouchableOpacity onPress={() => setVisible(false)}>
//               <Text style={styles.cancel}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   selectedContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   flag: {
//     fontSize: 22,
//     marginRight: 4,
//   },
//   dialCode: {
//     fontSize: 16,
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: '#00000099',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     maxHeight: '75%',
//     backgroundColor: Colors.WHITE,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 16,
//   },
//   search: {
//     backgroundColor: Colors.GRAY_LIGHT,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//   },
//   countryRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   name: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   cancel: {
//     color: Colors.ERROR,
//     textAlign: 'center',
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   sectionHeader: {
//     backgroundColor: Colors.GRAY_LIGHT,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: Colors.GRAY_DARK,
//   },
// });

// export default CountryPicker;
