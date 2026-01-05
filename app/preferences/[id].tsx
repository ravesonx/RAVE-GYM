import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Save } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreferenceDetailScreen() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<any>(null);

    // Initial Load
    useEffect(() => {
        const loadPreference = async () => {
            try {
                const data = await AsyncStorage.getItem('userPreferences');
                if (data) {
                    const preferences = JSON.parse(data);
                    if (preferences[id as string]) {
                        setSelectedOption(preferences[id as string]);
                    }
                }
            } catch (error) {
                console.error('Failed to load preference:', error);
            }
        };
        loadPreference();
    }, [id]);

    const handleSave = async () => {
        try {
            const data = await AsyncStorage.getItem('userPreferences');
            const preferences = data ? JSON.parse(data) : {};

            preferences[id as string] = selectedOption;

            await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
            router.back();
        } catch (error) {
            console.error('Failed to save preference:', error);
        }
    };

    const toggleSelection = (value: any) => {
        if (id === 'target') {
            const current = Array.isArray(selectedOption) ? selectedOption : [];
            if (current.includes(value)) {
                setSelectedOption(current.filter((item: any) => item !== value));
            } else {
                setSelectedOption([...current, value]);
            }
        } else {
            setSelectedOption(value);
        }
    };

    const renderContent = () => {
        switch (id) {
            case 'target':
                return (
                    <View>
                        <Text style={styles.questionText}>{t('profile.preferences.target.question')}</Text>
                        <OptionList
                            options={[
                                { value: 'loseWeight', label: t('profile.preferences.target.loseWeight') },
                                { value: 'gainMuscle', label: t('profile.preferences.target.gainMuscle') },
                                { value: 'maintainForm', label: t('profile.preferences.target.maintainForm') },
                                { value: 'endurance', label: t('profile.preferences.target.endurance') },
                                { value: 'reduceStress', label: t('profile.preferences.target.reduceStress') },
                            ]}
                            selected={selectedOption}
                            onSelect={toggleSelection}
                            multiSelect={true}
                        />
                    </View>
                );
            case 'experience':
                return (
                    <OptionList
                        options={[
                            { value: 'none', label: t('profile.preferences.experience.none') },
                            { value: 'lessThan1', label: t('profile.preferences.experience.lessThan1') },
                            { value: 'oneToTwo', label: t('profile.preferences.experience.oneToTwo') },
                            { value: 'moreThan2', label: t('profile.preferences.experience.moreThan2') },
                        ]}
                        selected={selectedOption}
                        onSelect={setSelectedOption}
                    />
                );
            case 'frequency':
                return (
                    <FrequencySlider
                        selected={selectedOption}
                        onSelect={setSelectedOption}
                        labels={{
                            low: t('profile.preferences.frequency.veryLittle'),
                            mid: t('profile.preferences.frequency.oneTwo'),
                            high: t('profile.preferences.frequency.threePlus')
                        }}
                    />
                );
            case 'formLevel':
                return (
                    <View>
                        <Text style={styles.questionText}>{t('profile.preferences.formLevel.question')}</Text>
                        <OptionList
                            options={[
                                { value: 'lessThan10', label: t('profile.preferences.formLevel.lessThan10') },
                                { value: 'tenToThirty', label: t('profile.preferences.formLevel.tenToThirty') },
                                { value: 'dontKnow', label: t('profile.preferences.formLevel.dontKnow') },
                            ]}
                            selected={selectedOption}
                            onSelect={setSelectedOption}
                        />
                    </View>
                );
            case 'weekly':
                return (
                    <View>
                        <Text style={styles.questionText}>{t('profile.preferences.weekly.question')}</Text>
                        <OptionList
                            options={Array.from({ length: 7 }, (_, i) => ({
                                value: (i + 1).toString(),
                                label: `${i + 1} Gün`
                            }))}
                            selected={selectedOption}
                            onSelect={setSelectedOption}
                        />
                    </View>
                );
            case 'daily':
                return (
                    <OptionList
                        options={[
                            { value: '15', label: t('profile.preferences.daily.mins15') },
                            { value: '30', label: t('profile.preferences.daily.mins30') },
                            { value: '45', label: t('profile.preferences.daily.mins45') },
                            { value: '60+', label: t('profile.preferences.daily.mins60Plus') },
                        ]}
                        selected={selectedOption}
                        onSelect={setSelectedOption}
                    />
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (id) {
            case 'target': return t('preferences.target.title');
            case 'experience': return t('preferences.experience.title');
            case 'frequency': return t('preferences.frequency.title');
            case 'formLevel': return t('preferences.formLevel.title');
            case 'weekly': return t('preferences.weekly.title');
            case 'daily': return t('preferences.daily.title');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('@/assets/images/gym_bg_v2.png')} style={styles.background} resizeMode="cover">
                <View style={styles.overlay} />
                <SafeAreaView style={styles.safeArea}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{getTitle()}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {renderContent()}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Save color="#000" size={24} />
                            <Text style={styles.saveButtonText}>{t('profile.preferences.save')}</Text>
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

// Components
const OptionList = ({ options, selected, onSelect, multiSelect = false }: any) => (
    <View style={styles.optionList}>
        {options.map((opt: any) => {
            const isSelected = multiSelect
                ? (Array.isArray(selected) && selected.includes(opt.value))
                : selected === opt.value;

            return (
                <TouchableOpacity
                    key={opt.value}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => onSelect(opt.value)}
                >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt.label}</Text>
                    {isSelected && <Check color="#000" size={20} />}
                </TouchableOpacity>
            )
        })}
    </View>
);

const FrequencySlider = ({ selected, onSelect, labels }: any) => {
    // Determine position based on selected value
    // Values: 'veryLittle', 'oneTwo', 'threePlus'
    const steps = ['veryLittle', 'oneTwo', 'threePlus'];
    const activeIndex = steps.indexOf(selected);

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.sliderBarContainer}>
                <View style={styles.sliderBar} />
                <View
                    style={[
                        styles.sliderFill,
                        { width: activeIndex === -1 ? '0%' : activeIndex === 0 ? '0%' : activeIndex === 1 ? '50%' : '100%' }
                    ]}
                />
                {/* Knobs */}
                {steps.map((step, index) => {
                    const isActive = selected === step;
                    const position = index === 0 ? '0%' : index === 1 ? '50%' : '100%';
                    return (
                        <TouchableOpacity
                            key={step}
                            style={[styles.sliderKnob, { left: position, marginLeft: -12 }, isActive && styles.sliderKnobActive]}
                            onPress={() => onSelect(step)}
                        >
                            <View style={[styles.sliderKnobInner, isActive && styles.sliderKnobInnerActive]} />
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={styles.sliderLabels}>
                <Text style={[styles.sliderLabel, { textAlign: 'left' }]}>{labels.low}</Text>
                <Text style={[styles.sliderLabel, { textAlign: 'center' }]}>{labels.mid}</Text>
                <Text style={[styles.sliderLabel, { textAlign: 'right' }]}>{labels.high}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.92)' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, marginBottom: 24 },
    backButton: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#fff', fontSize: 20, fontFamily: 'Oswald_700Bold', letterSpacing: 1, textTransform: 'uppercase' },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    questionText: { color: '#fff', fontSize: 18, fontFamily: 'Oswald_600SemiBold', marginBottom: 24, textAlign: 'center' },
    optionList: { gap: 12 },
    optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    optionItemSelected: { backgroundColor: Colors.dark.primary, borderColor: Colors.dark.primary },
    optionText: { color: '#fff', fontSize: 16, fontFamily: 'Oswald_500Medium' },
    optionTextSelected: { color: '#000' },
    footer: { padding: 24, paddingBottom: 40 },
    saveButton: { backgroundColor: Colors.dark.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
    saveButtonText: { color: '#000', fontSize: 16, fontFamily: 'Oswald_600SemiBold', letterSpacing: 0.5 },

    // Slider Styles
    sliderContainer: { marginTop: 40, paddingHorizontal: 12 },
    sliderBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, position: 'relative', marginVertical: 20, marginHorizontal: 0 },
    sliderBar: { flex: 1 },
    sliderFill: { position: 'absolute', height: '100%', backgroundColor: Colors.dark.primary, borderRadius: 2 },
    sliderKnob: { position: 'absolute', top: -10, width: 24, height: 24, borderRadius: 12, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#666' },
    sliderKnobActive: { borderColor: Colors.dark.primary, backgroundColor: '#000' },
    sliderKnobInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#666' },
    sliderKnobInnerActive: { backgroundColor: Colors.dark.primary },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    sliderLabel: { color: '#888', fontSize: 12, fontFamily: 'Inter_400Regular', width: '30%' }
});
