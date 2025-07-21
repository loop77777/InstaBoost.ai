import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CaptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'casual' | 'professional' | 'funny' | 'inspirational' | 'educational'>('casual');
  const [audience, setAudience] = useState<'general' | 'business' | 'lifestyle' | 'fitness' | 'food' | 'travel'>('general');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCall2Action, setIncludeCall2Action] = useState(true);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toneOptions = [
    { key: 'casual', label: '😊 Casual', color: '#4CAF50' },
    { key: 'professional', label: '💼 Professional', color: '#2196F3' },
    { key: 'funny', label: '😂 Funny', color: '#FF9800' },
    { key: 'inspirational', label: '✨ Inspirational', color: '#9C27B0' },
    { key: 'educational', label: '🎓 Educational', color: '#795548' },
  ];

  const audienceOptions = [
    { key: 'general', label: '👥 General' },
    { key: 'business', label: '💼 Business' },
    { key: 'lifestyle', label: '🌟 Lifestyle' },
    { key: 'fitness', label: '💪 Fitness' },
    { key: 'food', label: '🍽️ Food' },
    { key: 'travel', label: '✈️ Travel' },
  ];

  const lengthOptions = [
    { key: 'short', label: 'Short (50-100 chars)' },
    { key: 'medium', label: 'Medium (100-200 chars)' },
    { key: 'long', label: 'Long (200-500 chars)' },
  ];

  const generateCaption = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic for your caption');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API call later
      setTimeout(() => {
        const sampleCaption = `🌟 ${topic} is absolutely amazing! Here's why you should care about it and how it can transform your day. What do you think? Drop a comment below! 👇\\n\\n#${topic.replace(/\\s+/g, '').toLowerCase()} #inspiration #motivation #lifestyle #growth`;
        setGeneratedCaption(sampleCaption);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to generate caption. Please try again.');
    }
  };

  const copyToClipboard = () => {
    Alert.alert('Copied!', 'Caption copied to clipboard');
  };

  const ToggleButton: React.FC<{ label: string; value: boolean; onToggle: () => void }> = ({ label, value, onToggle }) => (
    <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <Ionicons 
          name={value ? 'checkmark' : 'close'} 
          size={16} 
          color={value ? 'white' : '#999'} 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Caption Generator</Text>
        <Text style={styles.subtitle}>Create engaging captions for your posts</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Topic/Theme</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What's your post about? (e.g., Morning coffee, sunset, workout)"
            value={topic}
            onChangeText={setTopic}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tone</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
            {toneOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  tone === option.key && { backgroundColor: option.color }
                ]}
                onPress={() => setTone(option.key as any)}
              >
                <Text style={[
                  styles.optionText,
                  tone === option.key && styles.optionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Audience</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
            {audienceOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  audience === option.key && styles.optionButtonActive
                ]}
                onPress={() => setAudience(option.key as any)}
              >
                <Text style={[
                  styles.optionText,
                  audience === option.key && styles.optionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Caption Length</Text>
          {lengthOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.lengthOption,
                length === option.key && styles.lengthOptionActive
              ]}
              onPress={() => setLength(option.key as any)}
            >
              <View style={[
                styles.radio,
                length === option.key && styles.radioActive
              ]} />
              <Text style={[
                styles.lengthLabel,
                length === option.key && styles.lengthLabelActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toggleSection}>
          <ToggleButton
            label="Include Emojis"
            value={includeEmojis}
            onToggle={() => setIncludeEmojis(!includeEmojis)}
          />
          <ToggleButton
            label="Include Hashtags"
            value={includeHashtags}
            onToggle={() => setIncludeHashtags(!includeHashtags)}
          />
          <ToggleButton
            label="Include Call-to-Action"
            value={includeCall2Action}
            onToggle={() => setIncludeCall2Action(!includeCall2Action)}
          />
        </View>

        <TouchableOpacity 
          style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
          onPress={generateCaption}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.generateButtonText}>Generate Caption</Text>
            </>
          )}
        </TouchableOpacity>

        {generatedCaption ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Generated Caption</Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                <Ionicons name="copy" size={20} color="#E1306C" />
              </TouchableOpacity>
            </View>
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{generatedCaption}</Text>
            </View>
            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="refresh" size={18} color="#2196F3" />
                <Text style={styles.actionButtonText}>Regenerate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Use Caption</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsScroll: {
    flexDirection: 'row',
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonActive: {
    backgroundColor: '#E1306C',
    borderColor: '#E1306C',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionTextActive: {
    color: 'white',
  },
  lengthOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  lengthOptionActive: {
    borderColor: '#E1306C',
    backgroundColor: '#fff5f8',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
  },
  radioActive: {
    borderColor: '#E1306C',
    backgroundColor: '#E1306C',
  },
  lengthLabel: {
    fontSize: 14,
    color: '#666',
  },
  lengthLabelActive: {
    color: '#E1306C',
    fontWeight: '500',
  },
  toggleSection: {
    marginBottom: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  generateButton: {
    backgroundColor: '#E1306C',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    padding: 8,
  },
  captionContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  captionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CaptionGenerator;
