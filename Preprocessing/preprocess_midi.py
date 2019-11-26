from mido import MidiFile, merge_tracks
# import numpy as np
from os import listdir
from os.path import exists
# import csv
import sys
import json

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
        sequence_position = sequence_position + 1

        if event['Type'] == 'note_on':
            single_note_on.append({
                'ID': note_id,
                'Start_tick': event['Tick'],
                'End_tick': -1,
                'Tick_interval': -1,
                'Start_timing': event['Timing'],
                'End_timing': -1,
                'Channel': event['Channel'],
                'Note_position': event['Note_position'],
                'Note_velocity': event['Note_velocity'],
                'Note_pitch_class': '',
                'Note_octave': -1
            })
            note_id = note_id + 1
        elif event['Type'] == 'note_off':
            try:
                note = next(s for s in single_note_on
                            if s['Channel'] == event['Channel'] and s['Note_position'] == event['Note_position'])
                single_note_on.remove(note)
                note['End_tick'] = event['Tick']
                note['Tick_duration'] = note['End_tick'] - note['Start_tick']
                note['End_timing'] = event['Timing']
                note['Note_pitch_class'] = pitch_class(event['Note_position'])
                note['Note_octave'] = (event['Note_position'] // 12) - 1
                notes.append(note)
                # print(json.dumps(note, separators=(',', ':')))
            except StopIteration:
                pass
    def takeID(element):
        return element["ID"]
    notes.sort(key=takeID)
    return events, notes, midi.ticks_per_beat

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
            events, notes, ticks_per_beat = parse_events(in_dir.replace('\\', '/')+in_path)
        except IOError as e:
            print(e)
            continue
        data = {
            'Filename': fname,
            'Ticks_per_beat': ticks_per_beat,
            'Events': events,
            'Notes': notes
        }
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
        translate_dir_json(sys.argv[1], 'out.json')
    elif len(sys.argv) == 3:
        translate_dir_json(sys.argv[1], sys.argv[2])
    elif len(sys.argv) > 3:
        n = len(sys.argv[1:-1])
        for i, d in enumerate(sys.argv[1:-1]):
            print('Loading folder {} of {}'.format(i+1, n))
            translate_dir_json(d, sys.argv[-1])

    else:
        print('Usage:\n\tpython preprocess_midi.py <in_dir_1> ... <in_dir_n> <?out_file="file_list.json"?>')