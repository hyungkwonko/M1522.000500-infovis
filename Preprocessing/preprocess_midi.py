#!/usr/bin/python
# coding: utf-8

from mido import MidiFile, merge_tracks
# import numpy as np
from os import listdir
from os.path import exists
# import csv
import sys
import json
import copy

def pitch_class(note_position):
    p = note_position % 12
    switcher = {
        0: 'C',
        1: 'C#',
        2: 'D',
        3: 'D#',
        4: 'E',
        5: 'F',
        6: 'F#',
        7: 'G',
        8: 'G#',
        9: 'A',
        10: 'A#',
        11: 'B'
    }
    return switcher.get(p)


def pitch_class_to_lower(pitch_class):
    switcher = {
      'C': 'c',
      'C#': 'c#',
      'D': 'd',
      'D#': 'd#',
      'E': 'e',
      'F': 'f',
      'F#': 'f#',
      'G': 'g',
      'G#': 'g#',
      'A': 'a',
      'A#': 'a#',
      'B': 'b'
    }
    return switcher.get(pitch_class)


def parse_events(f):
    midi = MidiFile(f)
    events = []
    notes = []
    single_note_on = []
    tick = 0
    timing = 0
    current_tempo = 500000  # default tempo (bpm 120)
    sequence_position = 0
    note_id = 0
    end_of_track = 0
    #print(midi.ticks_per_beat)

    for msg in merge_tracks(midi.tracks):
        tp = msg.type
        is_meta = msg.is_meta
        delta_tick = msg.time
        if delta_tick <= 0:
            delta_tick = 0
        tick = tick + delta_tick
        timing = timing + round(delta_tick * current_tempo / midi.ticks_per_beat)
        # timing = timing + tick2second(delta_tick, midi.ticks_per_beat, current_tempo)
        attributes = []
        channel = None
        note_velocity = None
        note_position = None
        tempo = None
        numerator = None
        denominator = None

        clocks_per_click = None
        notated_32nd_notes_per_beat = None
        key = None
        control = None
        value = None
        program = None
        if tp == 'note_on' or msg.type == 'note_off':
            channel = msg.channel
            note_position = msg.note
            note_velocity = msg.velocity
            if note_velocity == 0:
                tp = 'note_off'
            attributes= ['Channel', 'Note_position', 'Note_velocity']
        elif tp == 'control_change':
            channel = msg.channel
            control = msg.control
            value = msg.value
            attributes = ['Channel', 'Control', 'Value']
        elif tp == 'program_change':
            channel = msg.channel
            program = msg.program
            attributes = ['Channel', 'Program']
        elif tp == 'time_signature':
            numerator = msg.numerator
            denominator = msg.denominator
            clocks_per_click = msg.clocks_per_click
            notated_32nd_notes_per_beat = msg.notated_32nd_notes_per_beat
            attributes = ['Numerator', 'Denominator', 'Clocks_per_click', 'Notated_32nd_notes_per_beat']
        elif tp == 'key_signature':
            key = msg.key
            # Valid values: A A#m Ab Abm Am B Bb Bbm Bm C C# C#m Cb Cm D D#m Db Dm E Eb Ebm Em F F# F#m Fm G G#m Gb Gm
            attributes = ['key']
        elif tp == 'set_tempo':
            tempo = msg.tempo
            attributes = ['tempo']
        elif tp == 'end_of_track':
            end_of_track = tick

        event = {
            'Type': tp,
            'Is_meta': is_meta,
            'Delta_tick': delta_tick,
            'Tick': tick,
            'Timing': timing,
            'Current_tempo': current_tempo,
            'Sequence_position': sequence_position,
            'Attributes': attributes
        }
        if channel is not None:
            event['Channel'] = channel
        if note_position is not None:
            event['Note_position'] = note_position
        if note_velocity is not None:
            event['Note_velocity'] = note_velocity
        if tempo is not None:
            event['Tempo'] = tempo
        if numerator is not None:
            event['Numerator'] = numerator
        if denominator is not None:
            event['Denominator'] = denominator
        if clocks_per_click is not None:
            event['Clocks_per_click'] = clocks_per_click
        if notated_32nd_notes_per_beat is not None:
            event['Notated_32nd_notes_per_beat'] = notated_32nd_notes_per_beat
        if key is not None:
            event['Key'] = key
        if control is not None:
            event['Control'] = control
        if value is not None:
            event['Value'] = value
        if program is not None:
            event['Program'] = program
        events.append(event)
        if tp == 'set_tempo':
            current_tempo = msg.tempo
        if tp == 'time_signature':
            current_numerator = msg.numerator
            current_denominator = msg.denominator
        sequence_position = sequence_position + 1

        if event['Type'] == 'note_on':
            # 'ID'는 임시 아이디이고, 나중에 새로 할당함
            single_note_on.append({
                'ID': note_id,
                'Start_tick': event['Tick'],
                'End_tick': -1,
                'Start_timing': event['Timing'],
                'End_timing': -1,
                'Channel': event['Channel'],
                'Voice': -1,
                'Is_chord': False,
                'Note_position': event['Note_position'],
                'Note_velocity': event['Note_velocity'],
                'Note_pitch_class': '',
                'Note_octave': -1,
                'Note_duration': 0,
                'Following_rest_duration': 0
            })
            note_id = note_id + 1
        elif event['Type'] == 'note_off':
            try:
                note = next(s for s in single_note_on
                            if s['Channel'] == event['Channel'] and s['Note_position'] == event['Note_position'])
                single_note_on.remove(note)
                note['End_tick'] = event['Tick']
                note['End_timing'] = event['Timing']
                note['Note_pitch_class'] = pitch_class(event['Note_position'])
                note['Note_octave'] = (event['Note_position'] // 12) - 1
                notes.append(note)
                # print(json.dumps(note, separators=(',', ':')))
            except StopIteration:
                pass

    def round_tick(tick):
        tpb = midi.ticks_per_beat
        unit_tick = tpb / 8  # 32nd note
        """
            unit_triplet_tick = tpb / 6     # (8/3)th note
            candidate1 = abs((tick / unit_tick) - round(tick / unit_tick))
            candidate2 = abs(((tick - unit_triplet_tick) / unit_tick) - round((tick - unit_triplet_tick) / unit_tick))
            candidate3 = abs(((tick - 2 * unit_triplet_tick) / unit_tick) - round((tick - 2 * unit_triplet_tick) / unit_tick))
            candidate4 = abs(((tick - 4 * unit_triplet_tick) / unit_tick) - round((tick - 4 * unit_triplet_tick) / unit_tick))
            candidate5 = abs(((tick - 8 * unit_triplet_tick) / unit_tick) - round((tick - 8 * unit_triplet_tick) / unit_tick))
            min_candidate = min(candidate1, candidate2, candidate3, candidate4, candidate5)
            if min_candidate == candidate1:
                return round(round(tick / unit_tick) * unit_tick)
            elif min_candidate == candidate2:
                return round(round((tick - unit_triplet_tick) / unit_tick) * unit_tick + unit_triplet_tick)
            elif min_candidate == candidate3:
                return round(round((tick - 2 * unit_triplet_tick) / unit_tick) * unit_tick + 2 * unit_triplet_tick)
            elif min_candidate == candidate4:
                return round(round((tick - 4 * unit_triplet_tick) / unit_tick) * unit_tick + 4 * unit_triplet_tick)
            else:
                return round(round((tick - 8 * unit_triplet_tick) / unit_tick) * unit_tick + 8 * unit_triplet_tick)
        """
        return round(round(tick / unit_tick) * unit_tick)

    current_numerator = 4     # default time signature (4/4)
    current_denominator = 4   # default time signature (4/4)
    notations = []
    time_sigs = list(filter(lambda e: e['Type'] == 'time_signature', events))
    time_sigs.sort(key=(lambda e: e['Tick']))
    time_sigs_index = 0
    temp_tick = 0
    while temp_tick < end_of_track:
        next_bar_tick = min(end_of_track,
                            temp_tick + round(midi.ticks_per_beat * 4 * current_numerator / current_denominator))
        if temp_tick == 0 and (len(time_sigs) <= 0 or not time_sigs[0]['Tick'] == 0):
            notations.append({
              'Type': 'time_signature',
              'Tick': temp_tick,
              'Options': '4/4'
            })

        if next_bar_tick == end_of_track:
            break
        elif len(time_sigs) <= time_sigs_index:
            temp_tick = next_bar_tick
            notations.append({
              'Type': 'bar',
              'Tick': temp_tick,
              'Options': {'type': 'single'}
            })
        elif next_bar_tick < round_tick(time_sigs[time_sigs_index]['Tick']):
            temp_tick = next_bar_tick
            notations.append({
              'Type': 'bar',
              'Tick': temp_tick,
              'Options': {'type': 'single'}
            })
        elif next_bar_tick == round_tick(time_sigs[time_sigs_index]['Tick']):
            temp_tick = next_bar_tick
            notations.append({
              'Type': 'bar',
              'Tick': temp_tick,
              'Options': {'type': 'double'}
            })
            notations.append({
                'Type': 'time_signature',
                'Tick': temp_tick,
                'Options': str(time_sigs[time_sigs_index]['Numerator']) +
                           '/' + str(time_sigs[time_sigs_index]['Denominator'])
            })
            current_numerator = time_sigs[time_sigs_index]['Numerator']
            current_denominator = time_sigs[time_sigs_index]['Denominator']
            time_sigs_index = time_sigs_index + 1
        else:
            temp_tick = round_tick(time_sigs[time_sigs_index]['Tick'])
            if not temp_tick == 0:
                notations.append({
                  'Type': 'bar',
                  'Tick': temp_tick,
                  'Options': {'type': 'double'}
                })
            notations.append({
                'Type': 'time_signature',
                'Tick': temp_tick,
                'Options': str(time_sigs[time_sigs_index]['Numerator']) +
                           '/' + str(time_sigs[time_sigs_index]['Denominator'])
            })
            current_numerator = time_sigs[time_sigs_index]['Numerator']
            current_denominator = time_sigs[time_sigs_index]['Denominator']
            time_sigs_index = time_sigs_index + 1

    # notations에 clef, set_tempo, key_signature도 삽입
    # 우선 Tick 순으로 정렬하고, Tick이 같으면 bar, clef, key_signature,
    # set_tempo, time_signature 순으로 정렬
    def ordering_notations(notation):
        order = {
            'bar': 0,
            'clef': 1,
            'key_signature': 2,
            'set_tempo': 3,
            'time_signature': 4,
            'note': 5,
            'rest': 5
        }
        return order[notation['Type']]

    key_sigs = list(map(lambda e: {
        'Type': 'key_signature',
        'Tick': round_tick(e['Tick']),
        'Options': e['Key']
    }, list(filter(lambda e: e['Type'] == 'key_signature', events))))
    """
    set_tempos = list(map(lambda e: {
        'Type': 'set_tempo',
        'Tick': round_tick(e['Tick']),
        'Options': e['Tempo']
    }, list(filter(lambda e: e['Type'] == 'set_tempo', events))))
    """
    notations = notations + key_sigs  # + set_tempos
    notations.sort(key=lambda e: (e['Tick'], ordering_notations(e)))

    def duration_split(duration_tick):
        n = round_tick(duration_tick) * 8 / midi.ticks_per_beat
        durations = []
        twos = []
        for i in [32, 16, 8, 4, 2, 1]:
            twos.append(round(n // i))
            n = n % i
        succession = False
        for i in range(0, 6):
            if i == 0:
                for _ in range(0, twos[0]):
                    durations.append(32)  # '1'
                    succession = True
            elif twos[i] == 1:
                if succession:
                    durations[-1] = durations[-1] + pow(2, 5 - i)  # durations[-1] + 'd'
                else:
                    durations.append(pow(2, 5 - i))  # str(pow(2, i))
                    succession = True
            else:
                succession = False
        return list(map(lambda d: round_tick(d * midi.ticks_per_beat / 8), durations))

    def duration_notation(split_duration, is_rest):
        n = round_tick(split_duration) * 8 / midi.ticks_per_beat
        durations = []
        twos = []
        for i in [32, 16, 8, 4, 2, 1]:
            twos.append(round(n // i))
            n = n % i
        succession = False
        for i in range(0, 6):
            if i == 0:
                for _ in range(0, twos[0]):
                    durations.append('1')
                    succession = True
            elif twos[i] == 1:
                if succession:
                    durations[-1] = durations[-1] + 'd'
                else:
                    durations.append(str(pow(2, i)))
                    succession = True
            else:
                succession = False
        if is_rest:
            for i in range(0, len(durations)):
                durations[i] = durations[i] + 'r'
        if len(durations) == 1:
            return durations[0]
        else:
            print("Duration not split error!")
            return durations

    def duration(note_start, note_end, rest_end):
        tpb = midi.ticks_per_beat
        round_start = round_tick(note_start)
        round_mid = round_tick(note_end)
        round_end = round_tick(rest_end)
        N = round_mid - round_start
        R = round_end - round_mid
        unit_tick = tpb / 8             # 32nd note
        """
        unit_triplet_tick = tpb / 6     # (8/3)th note
        
        # chech if triplet
        is_triplet = False
        if not round_start % unit_tick == 0 or not round_end % unit_tick == 0:
            is_triplet = True
            unit_tick = unit_triplet_tick
        """

        # 음표와 쉼표 길이를 구해서, VexFlow의 음표 길이 표현법으로 반환하기
        # Do not consider tuplets
        M = min(round(1.34 * N), N + R)
        if N == M:
            # R == 0
            return N, 0
        unit_N = N / unit_tick
        unit_M = M / unit_tick
        k = 0
        while pow(2, k) <= unit_M:
            k = k + 1
        while k >= 1:
            k = k - 1
            unit_note_duration = (unit_M // pow(2, k)) * pow(2, k)
            if unit_note_duration >= unit_N:
                note_duration = round_tick(unit_note_duration * unit_tick)
                return note_duration, N + R - note_duration

        print("Duration error!")
        return 0, 0

    # TODO: 음표나 쉼표의 duration 동안에 notations 중 하나 이상이 끼어들면
    #       해당 음표나 쉼표를 나눠야 한다. 음표를 나누면 붙임줄도 붙여야 한다.
    #       붙임줄로 붙어 있는 대상끼리는 mouseover나 select 시 함께 움직여야 한다.

    notes.sort(key=(lambda e: e["Start_tick"]))
    sorted_notes = sorted(notes, key=(lambda e: (e["Start_tick"], e['Note_position'])))

    voices = []
    note_notations = []
    count = 0
    for note in sorted_notes:
        note['ID'] = count
        count = count + 1

    def find_note_by_id(id):
        return next(note for note in notes if note['ID'] == id)

    def note_position_to_string(pos):
        return pitch_class_to_lower(pitch_class(pos)) + '/' + str((pos // 12) - 1)

    for note in notes:
        temp_voices = []    # 이 음표가 할당될 수 있는 voice 후보들
        for v_info in voices:
            if v_info['Channel'] == note['Channel']:
                # 틱 수 비교할 때 최소 리듬 단위의 배수로 반올림하여 계산
                if round_tick(v_info['Notes'][-1]['Start_tick']) == round_tick(note['Start_tick']) and \
                    round_tick(v_info['Notes'][-1]['End_tick']) == round_tick(note['End_tick']):
                    # Is_chord == True
                    temp_voices.append((v_info, abs(v_info['Notes'][-1]['Note_position'] - note['Note_position']), True))
                elif round_tick(v_info['Notes'][-1]['End_tick']) <= round_tick(note['Start_tick']):
                    # Is_chord == False
                    temp_voices.append((v_info, abs(v_info['Notes'][-1]['Note_position'] - note['Note_position']), False))
        if len(temp_voices) == 0:
            # new voice
            note['Voice'] = len(voices)
            voices.append({'Channel': note['Channel'], 'Notes': [note], 'Start': round_tick(note['Start_tick']), 'End': note['End_tick']})
        else:
            def take_second(element):
                return element[1]

            # choose voice such that the last note's position is nearest to `note`'s position
            temp_voices.sort(key=take_second)
            if temp_voices[0][2]:
                # 선택된 voice에 가장 마지막으로 들어간 음표가 이 음과 화음인 경우
                note['Is_chord'] = True
            else:
                # 선택된 voice에 가장 마지막으로 들어간 음표가 이 음과 화음이 아닌 경우
                # 바로 이전에 이 성부에 할당되었던 화음이 아닌 음표와, 뒤따르는 쉼표의 duration 결정
                last = -1
                IDs = []
                keys = []
                while len(voices[voices.index(temp_voices[0][0])]['Notes']) >= -1 * last and \
                    find_note_by_id(voices[voices.index(temp_voices[0][0])]['Notes'][last]['ID'])['Note_duration'] == 0:
                    old_start = voices[voices.index(temp_voices[0][0])]['Start']
                    old_end = voices[voices.index(temp_voices[0][0])]['End']
                    new_start = round_tick(note['Start_tick'])
                    old_id = voices[voices.index(temp_voices[0][0])]['Notes'][last]['ID']
                    old_note = find_note_by_id(old_id)
                    """
                    if not old_id == notes[old_id]['ID']:
                        print("ID error!")
                    """
                    old_note['Note_duration'], old_note['Following_rest_duration'] = \
                        duration(old_start, old_end, new_start)
                    if not old_note['Note_duration'] == 0:
                        if not old_note['Is_chord']:
                            # end of chord
                            IDs.insert(0, old_note['ID'])
                            keys.insert(0, old_note['Note_position'])
                            note_notations.append({
                                'Type': 'note',
                                'Tick': round_tick(old_note['Start_tick']),
                                'End_tick': round_tick(old_note['Start_tick']) + old_note['Note_duration'],
                                'IDs': IDs[0],
                                'Element_id': str(IDs[0]) + '-' + str(round_tick(old_note['Start_tick'])),
                                'Keys': sorted(keys),
                                'Channel': old_note['Channel'],
                                'Voice': old_note['Voice'],
                                'Options': {}
                            })
                            IDs = []
                            keys = []
                        else:
                            # 화음인 음표들을 하나로 묶기
                            # start or middle of chord
                            IDs.insert(0, old_note['ID'])
                            keys.insert(0, old_note['Note_position'])

                    if not old_note['Following_rest_duration'] == 0 and not old_note['Is_chord']:
                        note_notations.append({
                            'Type': 'rest',
                            'Tick': round_tick(old_note['Start_tick']) + old_note['Note_duration'],
                            'End_tick': new_start,
                            'Channel': old_note['Channel'],
                            'Voice': old_note['Voice'],
                            'Options': {}
                        })
                    last = last - 1

                voices[voices.index(temp_voices[0][0])]['Start'] = round_tick(note['Start_tick'])
                voices[voices.index(temp_voices[0][0])]['End'] = note['End_tick']
            note['Voice'] = voices.index(temp_voices[0][0])
            voices[voices.index(temp_voices[0][0])]['Notes'].append(note)

    for voice in voices:
        # 어떤 voice에서 처음 등장하는 음표의 시작 위치가 곡의 시작이 아닌 경우 맨 앞에 쉼표 추가
        if len(voice['Notes']) >= 1 and round_tick(find_note_by_id(voice['Notes'][0]['ID'])['Start_tick']) > 0:
            note_notations.append({
                'Type': 'rest',
                'Tick': 0,
                'End_tick': round_tick(find_note_by_id(voice['Notes'][0]['ID'])['Start_tick']),
                'Channel': find_note_by_id(voice['Notes'][0]['ID'])['Channel'],
                'Voice': find_note_by_id(voice['Notes'][0]['ID'])['Voice'],
                'Options': {}
            })
        # 각 voices별로 마지막 음표와 이와 화음인 음표들의 길이, 이에 뒤따르는 쉼표 길이를 곡이 끝나는 시점을 이용해서 구하기
        last = -1
        IDs = []
        keys = []
        while len(voice['Notes']) >= -1 * last and \
            find_note_by_id(voice['Notes'][last]['ID'])['Note_duration'] == 0:
            old_id = voice['Notes'][last]['ID']
            old_note = find_note_by_id(old_id)
            old_note['Note_duration'], old_note['Following_rest_duration'] = \
                duration(voice['Start'], voice['End'], end_of_track)
            if not old_note['Note_duration'] == 0:
                if not old_note['Is_chord']:
                    # end of chord
                    IDs.insert(0, old_note['ID'])
                    keys.insert(0, old_note['Note_position'])
                    note_notations.append({
                        'Type': 'note',
                        'Tick': round_tick(old_note['Start_tick']),
                        'End_tick': round_tick(old_note['Start_tick']) + old_note['Note_duration'],
                        'IDs': IDs[0],
                        'Element_id': str(IDs[0]) + '-' + str(round_tick(old_note['Start_tick'])),
                        'Keys': sorted(keys),
                        'Channel': old_note['Channel'],
                        'Voice': old_note['Voice'],
                        'Options': {}
                    })
                    IDs = []
                    keys = []
                else:
                    # 화음인 음표들을 하나로 묶기
                    # start or middle of chord
                    IDs.insert(0, old_note['ID'])
                    keys.insert(0, old_note['Note_position'])

            if not old_note['Following_rest_duration'] == 0 and not old_note['Is_chord']:
                note_notations.append({
                    'Type': 'rest',
                    'Tick': round_tick(old_note['Start_tick']) + old_note['Note_duration'],
                    'End_tick': round_tick(end_of_track),
                    'Channel': old_note['Channel'],
                    'Voice': old_note['Voice'],
                    'Options': {}
                })
            last = last - 1

    # 악보 표기와 붙임줄 구성
    staves = []     # staves[voice][measure]['Notations'] 안에 해당 성부, 해당 마디의 악보 기호들이 들어 있다.
    ties = []
    has_tie = False
    tie_from_id = ''
    tie_first_indices = []
    current_key_signature = 'C'

    def get_stem_direction(keys):
        if sum(keys) / len(keys) > 70:
            return -1
        else:
            return 1

    for i in range(0, len(voices)):
        # TODO: staves에 현재 voice를 갖고 measure가 0인 새 stave 객체 추가
        # append new voice and first measure
        staves.append([{
            'End_bar': 'end',
            'Key_signature': current_key_signature,
            'Notations': []
        }])
        voice_notations = list(filter(lambda nn: nn['Voice'] == i, note_notations))
        voice_notations.sort(key=lambda nn: nn['Tick'])
        i1 = 0
        i2 = 0
        staves[i][-1]['Notations'].append({
            'Type': 'clef',
            'Tick': 0,
            'Options': 'treble'
        })
        # this algorithm is similar to merging two sorted lists
        while i1 < len(notations) and i2 < len(voice_notations):
            if notations[i1]['Tick'] <= voice_notations[i2]['Tick']:
                # 음표나 쉼표가 아닌 기호(조표, 박자표 등)를 그릴 것
                # 마디 구분선을 만나면 구분선은 그리지 않고 새로운 마디를 추가한다.
                if notations[i1]['Type'] == 'bar':
                    staves[i][-1]['End_bar'] = notations[i1]['Options']['type']
                    staves[i].append({
                        'End_bar': 'end',
                        'Key_signature': current_key_signature,
                        'Notations': []
                    })
                elif notations[i1]['Type'] == 'key_signature':
                    current_key_signature = notations[i1]['Options']
                    staves[i][-1]['Key_signature'] = current_key_signature
                    staves[i][-1]['Notations'].append(notations[i1])
                else:
                    staves[i][-1]['Notations'].append(notations[i1])
                i1 = i1 + 1
            else:
                # 음표 또는 쉼표를 그릴 것
                if notations[i1]['Tick'] >= voice_notations[i2]['End_tick']:
                    # 지금 그리는 음표 또는 쉼표가 끝나고 나서 다른 기호가 오는 경우
                    if voice_notations[i2]['Type'] == 'rest':
                        # 복잡한 박자일 경우 쪼갠다.
                        # 복잡한 박자란? (2분음표 + 8분음표)처럼 dot으로 표현되지 않아 붙임줄이 필요한 박자
                        split_durations = duration_split(voice_notations[i2]['End_tick'] -
                                                         voice_notations[i2]['Tick'])
                        new_notations = []
                        t = voice_notations[i2]['Tick']
                        for split_index in range(1, len(split_durations)):
                            t = t + split_durations[split_index - 1]
                            new_note2 = copy.deepcopy(voice_notations[i2])
                            new_note2['Tick'] = round_tick(t)
                            new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                            new_note2['Options'] = {
                                'keys': ['b/4'],
                                'duration': duration_notation(split_durations[split_index], True)
                            }
                            new_notations.append(new_note2)
                        voice_notations[i2]['End_tick'] = round_tick(voice_notations[i2]['Tick'] + split_durations[0])
                        voice_notations[i2]['Options'] = {
                            'keys': ['b/4'],
                            'duration': duration_notation(voice_notations[i2]['End_tick'] -
                                                          voice_notations[i2]['Tick'], True)
                        }
                    else:
                        # 복잡한 박자일 경우 쪼갠다.
                        split_durations = duration_split(voice_notations[i2]['End_tick'] -
                                                         voice_notations[i2]['Tick'])
                        new_notations = []
                        t = voice_notations[i2]['Tick']
                        voice_notations[i2]['Element_id'] = str(voice_notations[i2]['IDs']) + '-' + str(t)
                        if has_tie:
                            ties.append({
                                'from': tie_from_id,
                                'to': voice_notations[i2]['Element_id'],
                                'first_indices': tie_first_indices,
                                'last_indices': list(range(0, len(voice_notations[i2]['Keys'])))
                            })
                        tie_from_id = voice_notations[i2]['Element_id']
                        tie_first_indices = list(range(0, len(voice_notations[i2]['Keys'])))
                        for split_index in range(1, len(split_durations)):
                            t = t + split_durations[split_index - 1]
                            new_note2 = copy.deepcopy(voice_notations[i2])
                            new_note2['Tick'] = round_tick(t)
                            new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                            new_note2['Element_id'] = str(new_note2['IDs']) + '-' + str(t)
                            new_note2['Options'] = {
                                'keys': list(map(note_position_to_string, new_note2['Keys'])),
                                'duration': duration_notation(split_durations[split_index], False),
                                'stem_direction': get_stem_direction(new_note2['Keys'])
                            }
                            new_notations.append(new_note2)
                            ties.append({
                                'from': tie_from_id,
                                'to': new_note2['Element_id'],
                                'first_indices': tie_first_indices,
                                'last_indices': list(range(0, len(new_note2['Keys'])))
                            })
                            tie_from_id = new_note2['Element_id']
                            tie_first_indices = list(range(0, len(new_note2['Keys'])))
                            # new_note2.pop('Keys', None)

                        voice_notations[i2]['End_tick'] = round_tick(voice_notations[i2]['Tick'] + split_durations[0])
                        voice_notations[i2]['Options'] = {
                            'clef': 'treble',
                            'keys': list(map(note_position_to_string, voice_notations[i2]['Keys'])),
                            'duration': duration_notation(voice_notations[i2]['End_tick'] -
                                                          voice_notations[i2]['Tick'], False),
                            'stem_direction': get_stem_direction(voice_notations[i2]['Keys'])
                        }
                        voice_notations[i2].pop('Keys', None)
                    staves[i][-1]['Notations'].append(voice_notations[i2])
                    for notation in new_notations:
                        notation.pop('Keys', None)
                    staves[i][-1]['Notations'] = staves[i][-1]['Notations'] + new_notations
                    i2 = i2 + 1
                    has_tie = False
                else:
                    # 지금 그리는 음표 또는 쉼표가 끝나기 전에 다른 기호가 끼어드는 경우
                    # 음표 또는 쉼표를 두 개로 쪼개고
                    # 음표의 경우 쪼개진 것들끼리 붙임줄로 이어야 한다.
                    # 기호 앞의 음표 또는 쉼표를 여기서 처리하고,
                    # 기호 뒤의 음표 또는 쉼표는 다음 iteration에서 처리하도록 넘긴다.
                    new_note = copy.deepcopy(voice_notations[i2])
                    new_note['End_tick'] = notations[i1]['Tick']
                    if new_note['Type'] == 'rest':
                        # 복잡한 박자일 경우 쪼갠다.
                        split_durations = duration_split(new_note['End_tick'] -
                                                         new_note['Tick'])
                        new_notations = []
                        t = new_note['Tick']
                        for split_index in range(1, len(split_durations)):
                            t = t + split_durations[split_index - 1]
                            new_note2 = copy.deepcopy(new_note)
                            new_note2['Tick'] = round_tick(t)
                            new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                            new_note2['Options'] = {
                                'keys': ['b/4'],
                                'duration': duration_notation(split_durations[split_index], True)
                            }
                            new_notations.append(new_note2)

                        new_note['End_tick'] = round_tick(new_note['Tick'] + split_durations[0])
                        new_note['Options'] = {
                            'keys': ['b/4'],
                            'duration': duration_notation(new_note['End_tick'] -
                                                          new_note['Tick'], True)
                        }
                    else:
                        # 복잡한 박자일 경우 쪼갠다.
                        split_durations = duration_split(new_note['End_tick'] -
                                                         new_note['Tick'])
                        new_notations = []
                        t = new_note['Tick']
                        new_note['Element_id'] = str(new_note['IDs']) + '-' + str(t)
                        if has_tie:
                            ties.append({
                                'from': tie_from_id,
                                'to': new_note['Element_id'],
                                'first_indices': tie_first_indices,
                                'last_indices': list(range(0, len(new_note['Keys'])))
                            })
                        tie_from_id = new_note['Element_id']
                        tie_first_indices = list(range(0, len(new_note['Keys'])))
                        for split_index in range(1, len(split_durations)):
                            t = t + split_durations[split_index - 1]
                            new_note2 = copy.deepcopy(new_note)
                            new_note2['Tick'] = round_tick(t)
                            new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                            new_note2['Element_id'] = str(new_note2['IDs']) + '-' + str(t)
                            new_note2['Options'] = {
                                'keys': list(map(note_position_to_string, new_note2['Keys'])),
                                'duration': duration_notation(split_durations[split_index], True),
                                'stem_direction': get_stem_direction(new_note2['Keys'])
                            }
                            new_notations.append(new_note2)
                            ties.append({
                                'from': tie_from_id,
                                'to': new_note2['Element_id'],
                                'first_indices': tie_first_indices,
                                'last_indices': list(range(0, len(new_note2['Keys'])))
                            })
                            tie_from_id = new_note2['Element_id']
                            tie_first_indices = list(range(0, len(new_note2['Keys'])))

                        new_note['End_tick'] = round_tick(new_note['Tick'] + split_durations[0])
                        new_note['Options'] = {
                            'clef': 'treble',
                            'keys': list(map(note_position_to_string, new_note['Keys'])),
                            'duration': duration_notation(new_note['End_tick'] -
                                                          new_note['Tick'], False),
                            'stem_direction': get_stem_direction(new_note['Keys'])
                        }
                        new_note.pop('Keys', None)
                    staves[i][-1]['Notations'].append(new_note)
                    for notation in new_notations:
                        notation.pop('Keys', None)
                    staves[i][-1]['Notations'] = staves[i][-1]['Notations'] + new_notations
                    voice_notations[i2]['Tick'] = notations[i1]['Tick']
                    has_tie = True

        while i1 < len(notations):
            # 음표나 쉼표가 아닌 기호(조표, 박자표 등)를 그릴 것
            # 마디 구분선을 만나면 구분선은 그리지 않고 새로운 마디를 추가한다.
            if notations[i1]['Type'] == 'bar':
                staves[i][-1]['End_bar'] = notations[i1]['Options']['type']
                staves[i].append({
                    'End_bar': 'end',
                    'Key_signature': current_key_signature,
                    'Notations': []
                })
            elif notations[i1]['Type'] == 'key_signature':
                current_key_signature = notations[i1]['Options']
                staves[i][-1]['Key_signature'] = current_key_signature
                staves[i][-1]['Notations'].append(notations[i1])
            else:
                staves[i][-1]['Notations'].append(notations[i1])
            i1 = i1 + 1

        while i2 < len(voice_notations):
            if voice_notations[i2]['Type'] == 'rest':
                # 복잡한 박자일 경우 쪼갠다.
                split_durations = duration_split(voice_notations[i2]['End_tick'] -
                                                 voice_notations[i2]['Tick'])
                new_notations = []
                t = voice_notations[i2]['Tick']
                for split_index in range(1, len(split_durations)):
                    t = t + split_durations[split_index - 1]
                    new_note2 = copy.deepcopy(voice_notations[i2])
                    new_note2['Tick'] = round_tick(t)
                    new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                    new_note2['Options'] = {
                        'keys': ['b/4'],
                        'duration': duration_notation(split_durations[split_index], True)
                    }
                    new_notations.append(new_note2)

                voice_notations[i2]['End_tick'] = round_tick(voice_notations[i2]['Tick'] + split_durations[0])
                voice_notations[i2]['Options'] = {
                    'keys': ['b/4'],
                    'duration': duration_notation(voice_notations[i2]['End_tick'] -
                                                  voice_notations[i2]['Tick'], True)
                }
            else:
                # 복잡한 박자일 경우 쪼갠다.
                split_durations = duration_split(voice_notations[i2]['End_tick'] -
                                                 voice_notations[i2]['Tick'])
                new_notations = []
                t = voice_notations[i2]['Tick']
                voice_notations[i2]['Element_id'] = str(voice_notations[i2]['IDs']) + '-' + str(t)
                if has_tie:
                    ties.append({
                        'from': tie_from_id,
                        'to': voice_notations[i2]['Element_id'],
                        'first_indices': tie_first_indices,
                        'last_indices': list(range(0, len(voice_notations[i2]['Keys'])))
                    })
                tie_from_id = voice_notations[i2]['Element_id']
                tie_first_indices = list(range(0, len(voice_notations[i2]['Keys'])))
                for split_index in range(1, len(split_durations)):
                    t = t + split_durations[split_index - 1]
                    new_note2 = copy.deepcopy(voice_notations[i2])
                    new_note2['Tick'] = round_tick(t)
                    new_note2['End_tick'] = round_tick(t + split_durations[split_index])
                    new_note2['Element_id'] = str(new_note2['IDs']) + '-' + str(t)
                    new_note2['Options'] = {
                        'keys': list(map(note_position_to_string, new_note2['Keys'])),
                        'duration': duration_notation(split_durations[split_index], True),
                        'stem_direction': get_stem_direction(new_note2['Keys'])
                    }
                    new_notations.append(new_note2)
                    ties.append({
                        'from': tie_from_id,
                        'to': new_note2['Element_id'],
                        'first_indices': tie_first_indices,
                        'last_indices': list(range(0, len(new_note2['Keys'])))
                    })
                    tie_from_id = new_note2['Element_id']
                    tie_first_indices = list(range(0, len(new_note2['Keys'])))

                voice_notations[i2]['End_tick'] = round_tick(voice_notations[i2]['Tick'] + split_durations[0])
                voice_notations[i2]['Options'] = {
                    'clef': 'treble',
                    'keys': list(map(note_position_to_string, voice_notations[i2]['Keys'])),
                    'duration': duration_notation(voice_notations[i2]['End_tick'] -
                                                  voice_notations[i2]['Tick'], False),
                    'stem_direction': get_stem_direction(voice_notations[i2]['Keys'])
                }
                voice_notations[i2].pop('Keys', None)
            staves[i][-1]['Notations'].append(voice_notations[i2])
            for notation in new_notations:
                notation.pop('Keys', None)
            staves[i][-1]['Notations'] = staves[i][-1]['Notations'] + new_notations
            i2 = i2 + 1
            has_tie = False

    score = {
        'Staves': staves,
        'Ties': ties
    }
    return events, notes, midi.ticks_per_beat, score

"""
def event2vec(event):
    '''Transform a single event into a vector of length 4'''
    return np.array((event['Type'], event['Is_meta'], event['Delta_tick'], event['Tick'],
                     event['Timing'], event['Current_tempo'], event['Sequence_position'],
                     event['Channel'], event['Note_position'],
                     event['Note_velocity'], event['Tempo'], event['Numerator'],
                     event['Denominator'], event['Clocks_per_click'],
                     event['Notated_32nd_notes_per_beat'], event['Key'],
                     event['Control'], event['Value'], event['Program']),
                    dtype=('U30, bool, u4, u4, ' +
                           'u8, u4, u4, ' +
                           'u1, u1, ' +
                           'u1, u4, u4, ' +
                           'u1, u1, ' +
                           'u1, U4, ' +
                           'u1, u1, u1'))

def translate_file(in_path):
    '''Read midi file from in_path and return a vector representation'''
    events, notes, ticks_per_beat = parse_events(in_path)
    vecs = np.array([event2vec(e) for e in events])
    return vecs
"""

GO_UP = "\033[F"

"""
def translate_dir_csv(in_dir, out_file):
    '''Read all midi files in in_dir and create corresponding a single csv file'''
    if exists(out_file):
        skip_header = True
    else:
        skip_header = False
    f = open(out_file, 'a+')
    w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
    mid_files = listdir(in_dir)
    n = len(mid_files)
    mid_files.sort()
    flush_rate = max((n//20, 15))
    if not skip_header:
        w.writerow(['Filename',
            'Type',
            'Is_meta',
            'Delta_tick',
            'Tick',
            'Timing',
            'Current_tempo',
            'Sequence_position',
            'Channel',
            'Note_position',
            'Note_velocity',
            'Tempo',
            'Numerator',
            'Denominator',
            'Clocks_per_click',
            'Notated_32nd_notes_per_beat',
            'Key',
            'Control',
            'Value',
            'Program'])
    print() # allocate a line to write over and over
    for i, in_path in enumerate(mid_files):
        print(GO_UP+'Processing file {} of {}: {}'.format(i, n, in_path))
        if not (in_dir[-1] == '\\' or in_dir[-1] == '/'):
            in_dir = in_dir + '/'
        try:
            vecs = translate_file(in_dir.replace('\\', '/')+in_path)
        except IOError as e:
            print(e)
            continue
        l = vecs.tolist()
        fname = in_path.rstrip('.mid').rstrip('.MID').rstrip('.midi').rstrip('.MIDI')
        desc = (list([fname]) for x in range(len(l)))
        w.writerows(map(lambda x: tuple(x[0])+tuple(x[1]), zip(desc, l)))
        if i % flush_rate == 0:
            f.flush()
    f.close()
"""

def translate_dir_json(in_dir, out_file_list):
    if exists(out_file_list):
        f = open(out_file_list, 'r')
        file_list = json.loads(f.read())
        f.close()
    else:
        file_list = []
    mid_files = listdir(in_dir)
    n = len(mid_files)
    mid_files.sort()
    for i, in_path in enumerate(mid_files):
        fname = in_path.rstrip('.mid').rstrip('.MID').rstrip('.midi').rstrip('.MIDI')
        try:
            dup = next(d for d in file_list if d == fname)
            continue
        except StopIteration:
            pass
        print(GO_UP+'Processing file {} of {}: {}'.format(i, n, in_path))
        if not (in_dir[-1] == '\\' or in_dir[-1] == '/'):
            in_dir = in_dir + '/'
        try:
            events, notes, ticks_per_beat, score = parse_events(in_dir.replace('\\', '/')+in_path)
        except IOError as e:
            print(e)
            continue
        data = {
            'Filename': fname,
            'Ticks_per_beat': ticks_per_beat,
            'Events': events,
            'Notes': notes,
            'Score': score
        }
        """
        'Voices': list(map(lambda e: e['Channel'], voices)),
        'Notations': notations,
        'Note_notations': note_notations
        """
        file_list.append(fname)
        f = open(fname + '.json', 'w')
        f.write(json.dumps(data, separators=(',', ':')))
        f.close()
    f = open(out_file_list, 'w')
    f.write(json.dumps(file_list, indent=2))
    f.close()

if __name__ == '__main__':
    # simple tests
    if len(sys.argv) == 2:
        translate_dir_json(sys.argv[1], 'file_list.json')
    elif len(sys.argv) == 3:
        translate_dir_json(sys.argv[1], sys.argv[2])
    elif len(sys.argv) > 3:
        n = len(sys.argv[1:-1])
        for i, d in enumerate(sys.argv[1:-1]):
            print('Loading folder {} of {}'.format(i+1, n))
            translate_dir_json(d, sys.argv[-1])

    else:
        print('Usage:\n\tpython preprocess_midi.py <in_dir_1> ... <in_dir_n> <?out_file="file_list.json"?>')
